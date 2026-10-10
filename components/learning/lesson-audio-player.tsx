'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, Square, Sparkles, FastForward } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LessonAudioPlayerProps {
  lessonId: string;
  lessonTitle: string;
  contentToRead: string;
}

export function LessonAudioPlayer({
  lessonId,
  lessonTitle,
  contentToRead,
}: LessonAudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [rate, setRate] = useState<number>(1.0);
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  const [supported, setSupported] = useState(true);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const isPlayingRef = useRef(false);
  isPlayingRef.current = isPlaying;

  // Clean markdown and code formatting so speech sounds like a human teacher
  const sanitizeTextForSpeech = (raw: string): string => {
    return raw
      .replace(/```[\s\S]*?```/g, ' [Code sample omitted for audio] ') // Skip raw code blocks
      .replace(/`([^`]+)`/g, '$1') // Inline code
      .replace(/#+\s+/g, '') // Headings
      .replace(/\*\*([^*]+)\*\*/g, '$1') // Bold
      .replace(/\*([^*]+)\*/g, '$1') // Italic
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Links
      .replace(/>\s+/g, '') // Blockquotes
      .replace(/[-*+]\s+/g, '. ') // Lists
      .replace(/\n+/g, ' ') // Line breaks
      .trim();
  };

  // Check browser support and load voices
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setSupported(false);
      return;
    }

    const checkVoices = () => {
      const available = window.speechSynthesis.getVoices();
      if (available.length > 0) {
        setVoicesLoaded(true);
      }
    };

    checkVoices();
    window.speechSynthesis.onvoiceschanged = checkVoices;

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // When lesson changes, STOP any active speech immediately
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setIsPaused(false);
    utteranceRef.current = null;
  }, [lessonId]);

  const handlePlay = () => {
    if (!supported || typeof window === 'undefined') return;

    // If currently paused, resume
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    // Cancel any previous utterance to prevent overlapping audio
    window.speechSynthesis.cancel();

    const cleanScript = `Lesson: ${lessonTitle}. ${sanitizeTextForSpeech(contentToRead)}`;
    // Truncate to reasonable narration length to avoid browser speech timeout
    const narrationSlice = cleanScript.slice(0, 3500);

    const utterance = new SpeechSynthesisUtterance(narrationSlice);
    utteranceRef.current = utterance;

    const voices = window.speechSynthesis.getVoices();
    // Prefer friendly natural English voice
    const naturalVoice =
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

    if (naturalVoice) utterance.voice = naturalVoice;
    utterance.rate = rate;
    utterance.pitch = 1.0;
    utterance.lang = 'en-US';

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };

    // CRITICAL: Stop cleanly on completion — NEVER LOOP
    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      utteranceRef.current = null;
    };

    utterance.onerror = (e) => {
      if (e.error !== 'canceled' && e.error !== 'interrupted') {
        console.warn('Speech playback notice:', e.error);
      }
      setIsPlaying(false);
      setIsPaused(false);
      utteranceRef.current = null;
    };

    try {
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
      setIsPaused(false);
    } catch (err) {
      console.warn('Failed to start speech synthesis:', err);
      setIsPlaying(false);
    }
  };

  const handlePause = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (isPlaying && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsPlaying(false);
    }
  };

  const handleStop = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    utteranceRef.current = null;
  };

  const cycleSpeed = () => {
    const nextRate = rate === 1.0 ? 1.25 : rate === 1.25 ? 1.5 : 1.0;
    setRate(nextRate);
    // If playing, restart with new rate seamlessly
    if (isPlaying && !isPaused) {
      handleStop();
      setTimeout(handlePlay, 100);
    }
  };

  if (!supported) return null;

  return (
    <div className="p-3.5 bg-gradient-to-r from-purple-950/30 via-secondary/40 to-card border border-purple-500/20 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 shrink-0">
          <Volume2 className="w-4 h-4" />
        </div>
        <div>
          <div className="text-xs font-bold text-foreground flex items-center gap-2">
            <span>Audio Narration</span>
            {isPlaying && (
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-mono animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Playing
              </span>
            )}
            {isPaused && (
              <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full font-mono">
                Paused
              </span>
            )}
          </div>
          <p className="text-[11px] text-muted-foreground">
            Listen to an AI-narrated audio summary of this lesson
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Speed Toggle */}
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={cycleSpeed}
          className="h-8 px-2 text-xs font-mono text-muted-foreground hover:text-foreground"
          title="Change playback speed"
        >
          <FastForward className="w-3.5 h-3.5 mr-1" />
          <span>{rate}x</span>
        </Button>

        {/* Play/Resume Button */}
        {!isPlaying ? (
          <Button
            type="button"
            size="sm"
            onClick={handlePlay}
            className="h-8 px-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold gap-1.5 shadow-md shadow-purple-950/30 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>{isPaused ? 'Resume' : 'Play Audio'}</span>
          </Button>
        ) : (
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handlePause}
            className="h-8 px-3 rounded-xl border-border bg-secondary text-foreground text-xs font-semibold gap-1.5 cursor-pointer"
          >
            <Pause className="w-3.5 h-3.5" />
            <span>Pause</span>
          </Button>
        )}

        {/* Stop Button */}
        {(isPlaying || isPaused) && (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={handleStop}
            className="h-8 px-2.5 rounded-xl text-muted-foreground hover:text-rose-400 cursor-pointer"
            title="Stop narration"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
          </Button>
        )}
      </div>
    </div>
  );
}
