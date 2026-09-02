'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import type { LearningTaskItem, SubmitResult } from '@/lib/api/endpoints/rooms';

// Lightweight core renderers loaded synchronously
import { MultipleChoiceTask } from './task-renderers/multiple-choice-task';
import { TrueFalseTask } from './task-renderers/true-false-task';
import { ReadLearnTask } from './task-renderers/read-learn-task';

// Dynamic imports for heavy interactive renderers to split client JS bundle size
const MemoryGameTask = dynamic(() => import('./task-renderers/memory-game-task').then((m) => m.MemoryGameTask), {
  loading: () => <div className="p-6 text-center text-xs text-purple-400 font-semibold animate-pulse">Loading Memory Game...</div>,
});

const DragDropTask = dynamic(() => import('./task-renderers/drag-drop-task').then((m) => m.DragDropTask), {
  loading: () => <div className="p-6 text-center text-xs text-purple-400 font-semibold animate-pulse">Loading Drag & Drop Zone...</div>,
});

const CodeTaskRenderer = dynamic(() => import('./task-renderers/code-task').then((m) => m.CodeTaskRenderer), {
  loading: () => <div className="p-6 text-center text-xs text-purple-400 font-semibold animate-pulse">Loading Code Lab...</div>,
});

const GenericInteractiveTask = dynamic(() => import('./task-renderers/generic-interactive-task').then((m) => m.GenericInteractiveTask), {
  loading: () => <div className="p-6 text-center text-xs text-purple-400 font-semibold animate-pulse">Loading Interactive Exercise...</div>,
});

const MatchingTask = dynamic(() => import('./task-renderers/matching-task').then((m) => m.MatchingTask), {
  loading: () => <div className="p-6 text-center text-xs text-purple-400 font-semibold animate-pulse">Loading Matching Activity...</div>,
});

const OrderingTask = dynamic(() => import('./task-renderers/ordering-task').then((m) => m.OrderingTask), {
  loading: () => <div className="p-6 text-center text-xs text-purple-400 font-semibold animate-pulse">Loading Ordering Activity...</div>,
});

const FillBlankTask = dynamic(() => import('./task-renderers/fill-blank-task').then((m) => m.FillBlankTask), {
  loading: () => <div className="p-6 text-center text-xs text-purple-400 font-semibold animate-pulse">Loading Fill in Blank...</div>,
});

const ImageIdentificationTask = dynamic(() => import('./task-renderers/image-identification-task').then((m) => m.ImageIdentificationTask), {
  loading: () => <div className="p-6 text-center text-xs text-purple-400 font-semibold animate-pulse">Loading Visual Identification...</div>,
});

export interface TaskRendererProps {
  task: LearningTaskItem;
  onSubmit: (answer: unknown) => void;
  feedback: SubmitResult | null;
  isSubmitting: boolean;
}

/**
 * Master task type router — reads task.taskType and renders the correct interactive component.
 * Uses code splitting via next/dynamic for heavy interactive game & code lab modules.
 */
export function TaskRenderer({ task, onSubmit, feedback, isSubmitting }: TaskRendererProps) {
  switch (task.taskType) {
    case 'READ':
    case 'VIDEO_LESSON':
      return <ReadLearnTask task={task} onSubmit={onSubmit} feedback={feedback} isSubmitting={isSubmitting} />;

    case 'MULTIPLE_CHOICE':
      return <MultipleChoiceTask task={task} onSubmit={onSubmit} feedback={feedback} isSubmitting={isSubmitting} />;

    case 'TRUE_FALSE':
      return <TrueFalseTask task={task} onSubmit={onSubmit} feedback={feedback} isSubmitting={isSubmitting} />;

    case 'MATCHING':
    case 'IMAGE_MATCHING':
      return <MatchingTask task={task} onSubmit={onSubmit} feedback={feedback} isSubmitting={isSubmitting} />;

    case 'ORDERING':
      return <OrderingTask task={task} onSubmit={onSubmit} feedback={feedback} isSubmitting={isSubmitting} />;

    case 'FILL_BLANK':
      return <FillBlankTask task={task} onSubmit={onSubmit} feedback={feedback} isSubmitting={isSubmitting} />;

    case 'IMAGE_IDENTIFICATION':
    case 'CLASSIFICATION_GAME':
      return <ImageIdentificationTask task={task} onSubmit={onSubmit} feedback={feedback} isSubmitting={isSubmitting} />;

    case 'MEMORY_GAME':
      return <MemoryGameTask task={task} onSubmit={onSubmit} feedback={feedback} isSubmitting={isSubmitting} />;

    case 'DRAG_DROP':
      return <DragDropTask task={task} onSubmit={onSubmit} feedback={feedback} isSubmitting={isSubmitting} />;

    case 'CODE_TASK':
    case 'MINI_PROJECT':
      return <CodeTaskRenderer task={task} onSubmit={onSubmit} feedback={feedback} isSubmitting={isSubmitting} />;

    case 'PUZZLE':
    case 'AI_CONCEPT_GAME':
    case 'SCENARIO':
    case 'QUIZ':
    case 'SIMULATION':
    case 'CHALLENGE':
    default:
      return <GenericInteractiveTask task={task} onSubmit={onSubmit} feedback={feedback} isSubmitting={isSubmitting} />;
  }
}
