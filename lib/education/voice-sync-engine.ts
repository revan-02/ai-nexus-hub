export interface NarrationSegment {
  segmentId: string; // e.g. seg-scene-1-v1
  sceneId: string;
  version: number;
  text: string;
  audioDurationSec: number;
  speechRate?: number;
}

export type PlaybackState = 'idle' | 'playing' | 'paused' | 'completed' | 'error';

/**
 * Robust Voice Narration Manager that guarantees ZERO infinite loops,
 * prevents duplicate segment playback, and safely cleans up SpeechSynthesis events.
 */
export class VoiceSyncEngine {
  private activeSegmentId: string | null = null;
  private playedSegmentIds: Set<string> = new Set();
  private playbackState: PlaybackState = 'idle';
  private currentUtterance: any = null;
  private onStateChangeCallback?: (state: PlaybackState, activeSegmentId: string | null) => void;

  constructor(onStateChange?: (state: PlaybackState, activeSegmentId: string | null) => void) {
    this.onStateChangeCallback = onStateChange;
  }

  public getState(): PlaybackState {
    return this.playbackState;
  }

  public getActiveSegmentId(): string | null {
    return this.activeSegmentId;
  }

  public getStatus(): {
    activeSegmentId: string | null;
    completedSegmentsCount: number;
    playbackState: PlaybackState;
  } {
    return {
      activeSegmentId: this.activeSegmentId,
      completedSegmentsCount: this.playedSegmentIds.size,
      playbackState: this.playbackState,
    };
  }

  /**
   * Deterministic SHA-like segment identifier to ensure idempotency.
   */
  public generateSegmentId(sceneId: string, text: string): string {
    let hash = 0;
    const combined = `${sceneId}:::${text.trim()}`;
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0; // Convert to 32bit integer
    }
    return `seg-${sceneId}-${Math.abs(hash).toString(16)}`;
  }

  /**
   * Starts a segment execution while verifying idempotency and loop prevention.
   */
  public startSegment(
    segmentId: string,
    text: string
  ): { allowed: boolean; reason?: string } {
    if (this.playedSegmentIds.has(segmentId)) {
      return {
        allowed: false,
        reason: `Duplicate execution prevented for completed segment: ${segmentId}`,
      };
    }

    if (this.activeSegmentId === segmentId && this.playbackState === 'playing') {
      return {
        allowed: false,
        reason: `Duplicate execution prevented: segment ${segmentId} is already actively playing`,
      };
    }

    this.activeSegmentId = segmentId;
    this.setState('playing');
    return { allowed: true };
  }

  /**
   * Completes a segment, marking it in the idempotency set so it can never loop.
   */
  public completeSegment(segmentId: string): void {
    this.playedSegmentIds.add(segmentId);
    if (this.activeSegmentId === segmentId) {
      this.activeSegmentId = null;
    }
    this.setState('completed');
  }

  /**
   * Idempotently plays a narration segment.
   * If the segment is currently playing or has already played, it avoids duplicate restart.
   */
  public playSegment(
    segment: NarrationSegment,
    rate: number = 1.0,
    forceReplay: boolean = false
  ): { scheduled: boolean; reason?: string } {
    if (!segment || !segment.text) {
      return { scheduled: false, reason: 'Empty segment text' };
    }

    // Duplicate detection: prevent re-triggering the same segment in an uncontrolled loop
    if (this.activeSegmentId === segment.segmentId && this.playbackState === 'playing') {
      return { scheduled: false, reason: 'Segment already playing' };
    }

    if (!forceReplay && this.playedSegmentIds.has(segment.segmentId)) {
      return { scheduled: false, reason: 'Segment already played' };
    }

    // Cancel obsolete utterances and cleanup
    this.cancelPlayback();

    const startCheck = this.startSegment(segment.segmentId, segment.text);
    if (!startCheck.allowed) {
      return { scheduled: false, reason: startCheck.reason };
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        // Unfreeze potential stalled state in Chrome
        window.speechSynthesis.resume();

        const cleanText = segment.text.replace(/```[\s\S]*?```/g, ' ').slice(0, 3000);
        const utterance = new SpeechSynthesisUtterance(cleanText);
        this.currentUtterance = utterance;

        const voices = window.speechSynthesis.getVoices();
        const preferredVoice =
          voices.find(
            (v) =>
              v.lang.startsWith('en') &&
              (v.name.includes('Natural') ||
                v.name.includes('Google') ||
                v.name.includes('Samantha') ||
                v.name.includes('Jenny') ||
                v.name.includes('Daniel') ||
                v.name.includes('Premium'))
          ) || voices.find((v) => v.lang.startsWith('en'));

        if (preferredVoice) utterance.voice = preferredVoice;
        utterance.rate = Math.min(1.5, Math.max(0.7, rate));
        utterance.pitch = 1.0;
        utterance.lang = 'en-US';

        utterance.onstart = () => {
          this.setState('playing');
        };

        // Explicit single-shot completion — NEVER LOOPS
        utterance.onend = () => {
          this.completeSegment(segment.segmentId);
          this.currentUtterance = null;
        };

        utterance.onerror = (e) => {
          if (e.error !== 'canceled' && e.error !== 'interrupted') {
            console.warn('[VoiceSyncEngine] Speech notice:', e.error);
            this.setState('error');
          }
          this.currentUtterance = null;
        };

        window.speechSynthesis.speak(utterance);
        return { scheduled: true };
      } catch (err: any) {
        console.warn('[VoiceSyncEngine] Speech invocation error:', err?.message || err);
        this.setState('error');
        return { scheduled: false, reason: err?.message };
      }
    }

    // In non-browser / test environments
    this.completeSegment(segment.segmentId);
    return { scheduled: true };
  }

  public pause(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
    }
    this.setState('paused');
  }

  public resume(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.resume();
    }
    this.setState('playing');
  }

  public handlePlaybackError(e?: any): void {
    if (e && e.error !== 'canceled' && e.error !== 'interrupted') {
      console.warn('[VoiceSyncEngine] Speech notice:', e.error);
    }
    this.setState('error');
    this.currentUtterance = null;
  }

  public cancelPlayback(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
    this.currentUtterance = null;
    this.setState('idle');
  }

  public resetHistory(): void {
    this.playedSegmentIds.clear();
    this.activeSegmentId = null;
    this.cancelPlayback();
  }

  private setState(state: PlaybackState): void {
    this.playbackState = state;
    if (this.onStateChangeCallback) {
      this.onStateChangeCallback(state, this.activeSegmentId);
    }
  }
}
