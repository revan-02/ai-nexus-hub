'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Lock,
  Eye,
  Maximize2,
  Minimize2,
  CheckCircle2,
  BotOff,
  Wifi,
  Monitor
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { apiClient } from '@/lib/api/client';

interface QuizProctorGuardProps {
  assessmentId: string;
  assessmentTitle: string;
  maxStrikes?: number;
  onLockout?: (totalStrikes: number) => void;
  children: React.ReactNode;
}

export function QuizProctorGuard({
  assessmentId,
  assessmentTitle,
  maxStrikes = 3,
  onLockout,
  children,
}: QuizProctorGuardProps) {
  const [strikes, setStrikes] = useState(0);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [clientIpInfo, setClientIpInfo] = useState<string>('Dynamic Secured IP');

  // Suppress AI search shortcuts (Cmd+K, Ctrl+K) and disable external tool keys during quiz
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'p' || e.key === 't')) {
        e.preventDefault();
        e.stopPropagation();
        triggerViolation('Attempted shortcut / external tool opening (Cmd/Ctrl+' + e.key.toUpperCase() + ')');
      }
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, []);

  const triggerViolation = useCallback(
    (reason: string) => {
      if (isLockedOut) return;

      setStrikes((prev) => {
        const nextStrikes = prev + 1;

        // Log anti-cheat violation to backend security audit
        apiClient
          .post(`/api/assessments/${assessmentId}/proctor`, {
            violationType: `${reason} (Strike ${nextStrikes}/${maxStrikes})`,
          })
          .catch(() => {});

        if (nextStrikes >= maxStrikes) {
          setIsLockedOut(true);
          setWarningMessage(
            `EXAM TERMINATED: Maximum anti-cheat violations (${maxStrikes}) reached. Your quiz attempt has been locked and flagged for review.`
          );
          if (onLockout) onLockout(nextStrikes);
        } else {
          setWarningMessage(
            `SECURITY WARNING (${nextStrikes}/${maxStrikes}): ${reason}. Opening external AI tabs or switching applications is strictly prohibited.`
          );
        }

        return nextStrikes;
      });
    },
    [assessmentId, isLockedOut, maxStrikes, onLockout]
  );

  // Tab Visibility & Focus Listeners
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        triggerViolation('Tab switched / backgrounded');
      }
    };

    const handleWindowBlur = () => {
      triggerViolation('Window lost focus / application switch detected');
    };

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      if (!document.fullscreenElement) {
        triggerViolation('Exited fullscreen lockdown mode');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [triggerViolation]);

  const requestFullscreenLock = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  };

  return (
    <div className="relative space-y-4">
      {/* Proctoring Status Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-gradient-to-r from-red-950/40 via-purple-950/30 to-background border border-red-500/30 rounded-2xl text-xs select-none">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
          </span>
          <div className="flex items-center gap-2 font-bold text-foreground">
            <ShieldAlert className="w-4 h-4 text-red-400" />
            <span>EXAM LOCKDOWN ACTIVE</span>
          </div>
          <span className="px-2 py-0.5 bg-red-500/20 text-red-300 border border-red-500/30 font-mono text-[10px] rounded-md font-bold flex items-center gap-1">
            <BotOff className="w-3 h-3" /> AI Assistant Disabled
          </span>
        </div>

        <div className="flex items-center gap-4 text-muted-foreground font-mono text-[11px]">
          <div className="flex items-center gap-1 text-zinc-300">
            <Monitor className="w-3.5 h-3.5 text-purple-400" />
            <span>Device Locked</span>
          </div>
          <div className="flex items-center gap-1 text-zinc-300">
            <Wifi className="w-3.5 h-3.5 text-blue-400" />
            <span>Dynamic IP Logged</span>
          </div>
          <div
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg border font-bold ${
              strikes === 0
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
                : strikes < maxStrikes
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30 animate-pulse'
                : 'bg-red-500/20 text-red-300 border-red-500/30'
            }`}
          >
            <span>Strikes: {strikes} / {maxStrikes}</span>
          </div>
          <button
            onClick={requestFullscreenLock}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 bg-secondary hover:bg-secondary/80 border border-border rounded-lg text-foreground transition-all cursor-pointer"
            title="Fullscreen Lockdown"
          >
            <Maximize2 className="w-3 h-3 text-purple-400" />
            <span>Fullscreen</span>
          </button>
        </div>
      </div>

      {/* Warning Modal / Overlay on Violation */}
      {warningMessage && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="max-w-md w-full p-6 bg-card border-red-500/50 rounded-2xl shadow-2xl space-y-4 text-center animate-in fade-in zoom-in duration-200">
            <div className="w-14 h-14 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-foreground">
                {isLockedOut ? 'EXAM TERMINATED & FLAGGED' : 'ANTI-CHEAT WARNING'}
              </h3>
              <p className="text-xs text-red-300 leading-relaxed">{warningMessage}</p>
            </div>
            <div className="p-3 bg-secondary/50 rounded-xl border border-border text-[11px] text-muted-foreground text-left space-y-1">
              <p>• AI Assistants, external tabs, and window switching are prohibited.</p>
              <p>• All violations are logged with your Dynamic IP and session footprint.</p>
              <p>• Strikes accumulated: <strong>{strikes} of {maxStrikes}</strong></p>
            </div>
            {!isLockedOut && (
              <Button
                onClick={() => {
                  setWarningMessage(null);
                  requestFullscreenLock();
                }}
                className="w-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold h-9 rounded-xl shadow-lg shadow-red-950/50 cursor-pointer"
              >
                I Understand — Return to Exam
              </Button>
            )}
          </Card>
        </div>
      )}

      {/* Main Proctored Quiz Body */}
      <div className={isLockedOut ? 'pointer-events-none opacity-40 filter blur-xs' : ''}>
        {children}
      </div>
    </div>
  );
}
