export interface EditableScene {
  sceneId: string;
  order?: number;
  phase?: 'intro' | 'concept' | 'demo' | 'real_world' | 'practice' | 'recap';
  title: string;
  narrationText: string;
  exampleText?: string;
  audioAssetId?: string;
  audioDurationSec?: number;
  durationSec?: number;
  visualKey?: string;
  captions?: string;
  startTimeSec?: number;
  endTimeSec?: number;
  version: number;
  renderStatus?: 'ready' | 'rendering' | 'dirty' | 'failed';
  status?: string;
  lastModifiedAt?: string;
}

export type SceneDefinition = EditableScene;

export interface LessonVersionSnapshot {
  versionId: string;
  lessonId: string;
  scenes: EditableScene[];
  totalDurationSec: number;
  publishedAt: string;
  checksum: string;
}

/**
 * Scene Manager class providing atomic edits, delta regenerations, and rollback capabilities.
 */
export class SceneEngine {
  private currentScenes: EditableScene[] = [];
  private historyStack: LessonVersionSnapshot[] = [];
  private lessonId: string;

  constructor(lessonId: string, initialScenes?: EditableScene[]) {
    this.lessonId = lessonId;
    if (initialScenes && initialScenes.length > 0) {
      let cursor = 0;
      this.currentScenes = initialScenes.map((s, idx) => {
        const dur = s.audioDurationSec ?? s.durationSec ?? 30;
        const start = s.startTimeSec ?? cursor;
        const end = s.endTimeSec ?? start + dur;
        cursor = end;
        return {
          ...s,
          order: s.order ?? idx + 1,
          audioDurationSec: dur,
          durationSec: dur,
          startTimeSec: start,
          endTimeSec: end,
          status: s.status ?? s.renderStatus ?? 'ready',
          renderStatus: (s.renderStatus ?? s.status ?? 'ready') as any,
          version: s.version ?? 1,
        };
      });
      this.recalculateTimestamps();
      this.saveSnapshot();
    }
  }

  public getScenes(): EditableScene[] {
    return JSON.parse(JSON.stringify(this.currentScenes));
  }

  public getSceneById(sceneId: string): EditableScene | undefined {
    return this.currentScenes.find((s) => s.sceneId === sceneId);
  }

  public getTotalDuration(): number {
    return this.currentScenes.reduce((acc, s) => acc + (s.audioDurationSec ?? s.durationSec ?? 0), 0);
  }

  /**
   * Save a snapshot into the version history stack before performing edits.
   */
  public saveSnapshot(): LessonVersionSnapshot {
    const snapshot: LessonVersionSnapshot = {
      versionId: `v-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      lessonId: this.lessonId,
      scenes: JSON.parse(JSON.stringify(this.currentScenes)),
      totalDurationSec: this.getTotalDuration(),
      publishedAt: new Date().toISOString(),
      checksum: this.generateChecksum(this.currentScenes),
    };
    this.historyStack.push(snapshot);
    // Keep last 10 versions in history
    if (this.historyStack.length > 10) {
      this.historyStack.shift();
    }
    return snapshot;
  }

  /**
   * Performs an isolated scene-level edit.
   * Editing Scene 3 ONLY modifies Scene 3 and bumps its version, without touching other scenes!
   */
  public updateScene(
    sceneId: string,
    updates: Partial<EditableScene>
  ): { success: boolean; updatedScene?: EditableScene; affectedScenes: string[] } {
    const targetIndex = this.currentScenes.findIndex((s) => s.sceneId === sceneId);
    if (targetIndex === -1) {
      return { success: false, affectedScenes: [] };
    }

    // Save previous state to snapshot for instant rollback capability
    this.saveSnapshot();

    const existing = this.currentScenes[targetIndex];
    const newVersion = (existing.version || 1) + 1;
    const dur = updates.audioDurationSec ?? updates.durationSec ?? existing.audioDurationSec ?? existing.durationSec ?? 30;

    // Apply updates strictly to target scene
    const updated: EditableScene = {
      ...existing,
      ...updates,
      audioDurationSec: dur,
      durationSec: dur,
      version: newVersion,
      renderStatus: (updates.renderStatus ?? updates.status ?? 'ready') as any,
      status: (updates.status ?? updates.renderStatus ?? 'ready') as any,
      lastModifiedAt: new Date().toISOString(),
    };

    this.currentScenes[targetIndex] = updated;

    // Recalculate timeline timestamps across all scenes
    this.recalculateTimestamps();

    return {
      success: true,
      updatedScene: updated,
      affectedScenes: [sceneId], // Only target scene is invalidated
    };
  }

  /**
   * Regenerates a single scene's narration or duration in isolation.
   */
  public regenerateSceneContent(
    sceneId: string,
    newNarrationText: string,
    newDurationSec?: number
  ): { success: boolean; regeneratedScene?: EditableScene } {
    const target = this.getSceneById(sceneId);
    if (!target) return { success: false };

    const estimatedDuration =
      newDurationSec || Math.max(10, Math.round(newNarrationText.split(/\s+/).length / 2.2));

    const result = this.updateScene(sceneId, {
      narrationText: newNarrationText,
      captions: newNarrationText,
      audioDurationSec: estimatedDuration,
      durationSec: estimatedDuration,
      audioAssetId: `audio-${sceneId}-v${(target.version || 1) + 1}`,
    });

    return {
      success: result.success,
      regeneratedScene: result.updatedScene,
    };
  }

  /**
   * Safe rollback: Restores the previous validated version if generation or render fails.
   */
  public rollback(): { success: boolean; restoredVersion?: LessonVersionSnapshot } {
    if (this.historyStack.length <= 1) {
      return { success: false };
    }

    // Pop current snapshot and restore preceding valid snapshot
    this.historyStack.pop();
    const previous = this.historyStack[this.historyStack.length - 1];

    if (previous) {
      this.currentScenes = JSON.parse(JSON.stringify(previous.scenes));
      this.recalculateTimestamps();
      return { success: true, restoredVersion: previous };
    }

    return { success: false };
  }

  private recalculateTimestamps(): void {
    let currentCursor = 0;
    this.currentScenes.forEach((scene) => {
      const dur = scene.audioDurationSec ?? scene.durationSec ?? 30;
      scene.startTimeSec = currentCursor;
      scene.endTimeSec = currentCursor + dur;
      scene.audioDurationSec = dur;
      scene.durationSec = dur;
      currentCursor = scene.endTimeSec;
    });
  }

  private generateChecksum(scenes: EditableScene[]): string {
    const raw = scenes.map((s) => `${s.sceneId}:${s.version}:${s.narrationText?.length || 0}`).join('|');
    return `chk-${raw.length}-${scenes.length}`;
  }
}
