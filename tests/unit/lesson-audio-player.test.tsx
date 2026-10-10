import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { LessonAudioPlayer } from '@/components/learning/lesson-audio-player';

describe('LessonAudioPlayer Component', () => {
  let mockSpeak: any;
  let mockCancel: any;
  let mockPause: any;
  let mockResume: any;

  beforeEach(() => {
    mockSpeak = vi.fn();
    mockCancel = vi.fn();
    mockPause = vi.fn();
    mockResume = vi.fn();

    Object.defineProperty(window, 'speechSynthesis', {
      writable: true,
      value: {
        speak: mockSpeak,
        cancel: mockCancel,
        pause: mockPause,
        resume: mockResume,
        getVoices: vi.fn().mockReturnValue([
          { name: 'Google Natural US English', lang: 'en-US' },
        ]),
        paused: false,
        onvoiceschanged: null,
      },
    });

    class MockUtterance {
      text: string;
      rate = 1.0;
      pitch = 1.0;
      lang = 'en-US';
      onstart: any = null;
      onend: any = null;
      onerror: any = null;
      constructor(text: string) {
        this.text = text;
      }
    }

    (window as any).SpeechSynthesisUtterance = MockUtterance;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders audio player with initial Play Audio button', () => {
    render(
      <LessonAudioPlayer
        lessonId="les-1"
        lessonTitle="Python Variables"
        contentToRead="Variables store data in computer memory."
      />
    );

    expect(screen.getByText('Audio Narration')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /play audio/i })).toBeInTheDocument();
  });

  it('triggers speech synthesis once when play button is clicked', () => {
    render(
      <LessonAudioPlayer
        lessonId="les-1"
        lessonTitle="Python Variables"
        contentToRead="Variables store data in memory."
      />
    );

    const playBtn = screen.getByRole('button', { name: /play audio/i });
    fireEvent.click(playBtn);

    expect(mockSpeak).toHaveBeenCalledTimes(1);
    expect(mockCancel).toHaveBeenCalled(); // Cleans previous before speaking
  });

  it('cancels speech synthesis when lessonId prop changes', () => {
    const { rerender } = render(
      <LessonAudioPlayer
        lessonId="les-1"
        lessonTitle="Python Variables"
        contentToRead="Lesson 1 content"
      />
    );

    mockCancel.mockClear();

    rerender(
      <LessonAudioPlayer
        lessonId="les-2"
        lessonTitle="Python Loops"
        contentToRead="Lesson 2 content"
      />
    );

    expect(mockCancel).toHaveBeenCalled();
  });

  it('cancels speech synthesis on component unmount', () => {
    const { unmount } = render(
      <LessonAudioPlayer
        lessonId="les-1"
        lessonTitle="Python Variables"
        contentToRead="Variables store data"
      />
    );

    mockCancel.mockClear();
    unmount();
    expect(mockCancel).toHaveBeenCalled();
  });
});
