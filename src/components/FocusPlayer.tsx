import React, { useState, useEffect, useRef } from 'react';
import { FocusSession } from '../types';
import { formatDuration } from '../utils/youtube';
import { soundManager } from '../utils/audio';
import { Mascot } from './Mascot';
import {
  Play,
  Pause,
  StopCircle,
  Plus,
  ShieldCheck,
  BookOpen,
  Edit3,
  CheckCircle2,
  AlertTriangle,
  Smartphone,
  Eye,
  Maximize2
} from 'lucide-react';

interface FocusPlayerProps {
  session: FocusSession;
  onUpdateSession: (updated: FocusSession) => void;
  onCompleteSession: (completedGoal: 'full' | 'partial' | 'review') => void;
  onEndEarly: () => void;
  onOpenAppBlockerSim: (appName: string) => void;
}

export const FocusPlayer: React.FC<FocusPlayerProps> = ({
  session,
  onUpdateSession,
  onCompleteSession,
  onEndEarly,
  onOpenAppBlockerSim
}) => {
  const [isRunning, setIsRunning] = useState(session.status === 'running');
  const [remainingSeconds, setRemainingSeconds] = useState(session.remainingSeconds);
  const [showNotes, setShowNotes] = useState(false);
  const [notesText, setNotesText] = useState(session.notes || '');
  const [distractionAlert, setDistractionAlert] = useState<{ show: boolean; msg: string } | null>(null);
  const [videoEndedPrompt, setVideoEndedPrompt] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Focus Shield: Detect when user leaves the window or switches tabs
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isRunning) {
        soundManager.playDistractionWarning();
        const updatedCount = session.distractionsPreventedCount + 1;
        onUpdateSession({
          ...session,
          distractionsPreventedCount: updatedCount,
          remainingSeconds
        });
        setDistractionAlert({
          show: true,
          msg: `Distraction Shield Intercepted: Tab switch detected! Apps are restricted.`
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isRunning, session, remainingSeconds, onUpdateSession]);

  // Main countdown timer interval
  useEffect(() => {
    if (isRunning && remainingSeconds > 0) {
      timerRef.current = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            soundManager.playCompletionChime();
            onCompleteSession('full');
            return 0;
          }
          const next = prev - 1;
          const actual = session.targetDurationSeconds - next;
          onUpdateSession({
            ...session,
            remainingSeconds: next,
            actualDurationSeconds: actual,
            status: 'running',
            notes: notesText
          });
          return next;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, onCompleteSession]);

  // Handle Play / Pause toggling
  const handleTogglePlayPause = () => {
    soundManager.playTick();
    if (isRunning) {
      setIsRunning(false);
      onUpdateSession({
        ...session,
        status: 'paused',
        remainingSeconds,
        notes: notesText
      });
    } else {
      setIsRunning(true);
      onUpdateSession({
        ...session,
        status: 'running',
        remainingSeconds,
        notes: notesText
      });
    }
  };

  // Extend session
  const handleExtend = (extraMinutes: number) => {
    soundManager.playTick();
    const extraSeconds = extraMinutes * 60;
    const newRemaining = remainingSeconds + extraSeconds;
    const newTarget = session.targetDurationSeconds + extraSeconds;
    setRemainingSeconds(newRemaining);
    onUpdateSession({
      ...session,
      remainingSeconds: newRemaining,
      targetDurationSeconds: newTarget
    });
  };

  // Video finished early prompt
  const handleVideoFinishedEarly = () => {
    setVideoEndedPrompt(true);
  };

  const progressPercent = Math.min(
    100,
    Math.round(((session.targetDurationSeconds - remainingSeconds) / session.targetDurationSeconds) * 100)
  );

  // SVG circular timer coordinates
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="flex-1 flex flex-col p-3 sm:p-4 space-y-3 max-w-xl mx-auto w-full">
      {/* Distraction Alert Banner */}
      {distractionAlert?.show && (
        <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-900 dark:text-amber-200 text-xs font-semibold flex items-center justify-between animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>{distractionAlert.msg}</span>
          </div>
          <button
            onClick={() => setDistractionAlert(null)}
            className="px-2 py-1 rounded-lg bg-amber-500/20 text-[10px] font-bold hover:bg-amber-500/30 cursor-pointer"
          >
            Acknowledge
          </button>
        </div>
      )}

      {/* Status Bar Indicator */}
      <div className="flex items-center justify-between bg-[#FAF7F2] dark:bg-[#202224] p-2 rounded-xl border border-[#E8DEC9] dark:border-[#2D3033]">
        <div className="flex items-center gap-2">
          <Mascot size="xs" animate={true} />
          <div>
            <span className="text-xs font-black text-[#1E293B] dark:text-[#F5F0E6] uppercase tracking-wider block leading-tight">
              One Video · Deep Focus
            </span>
            <span className="text-[10px] text-[#3A89A8] dark:text-[#87CEEB] font-bold">
              Focus. Learn. Grow.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#87CEEB]/20 text-[#3A89A8] dark:text-[#87CEEB] flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            {session.blockedApps.length} Apps Blocked
          </span>
        </div>
      </div>

      {/* Mindora Dedicated Focus Video Player */}
      <div className="relative w-full rounded-2xl overflow-hidden bg-black shadow-md border-2 border-[#87CEEB]/60 aspect-video group">
        {/*
          Embedding with rel=0, modestbranding=1, iv_load_policy=3, playsinline=1
          Restricts extraneous recommendations and confines the player strictly to the selected video
        */}
        <iframe
          ref={iframeRef}
          src={`https://www.youtube-nocookie.com/embed/${session.video.id}?autoplay=1&enablejsapi=1&rel=0&modestbranding=1&controls=1&iv_load_policy=3&playsinline=1`}
          title={session.video.title}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />

        {/* Protection badge overlay */}
        <div className="absolute top-2 left-2 pointer-events-none z-10">
          <span className="px-2 py-0.5 rounded-md bg-black/70 text-[#87CEEB] text-[9px] font-bold tracking-wider uppercase backdrop-blur-xs flex items-center gap-1">
            <ShieldCheck className="w-2.5 h-2.5" />
            Mindora Player
          </span>
        </div>
      </div>

      {/* Video Details */}
      <div className="bg-[#FAF7F2] dark:bg-[#202224] p-3 rounded-xl border border-[#E8DEC9] dark:border-[#2D3033]">
        <h2 className="text-xs sm:text-sm font-bold text-[#1E293B] dark:text-[#F5F0E6] line-clamp-1 leading-snug">
          {session.video.title}
        </h2>
        <div className="flex items-center justify-between text-[11px] text-[#64748B] dark:text-[#A0AAB8] mt-1">
          <span>{session.video.author}</span>
          <button
            onClick={handleVideoFinishedEarly}
            className="text-[11px] font-bold text-[#3A89A8] dark:text-[#87CEEB] hover:underline cursor-pointer"
          >
            Video finished early?
          </button>
        </div>
      </div>

      {/* Circular Timer & Controls Card */}
      <div className="bg-[#FAF7F2] dark:bg-[#202224] p-4 rounded-2xl border border-[#E8DEC9] dark:border-[#2D3033] flex flex-col items-center justify-center">
        {/* SVG Circular Countdown */}
        <div className="relative w-36 h-36 flex items-center justify-center my-1">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
            {/* Background ring in Beige/Dark border */}
            <circle
              cx="60"
              cy="60"
              r={radius}
              className="stroke-[#E8DEC9] dark:stroke-[#333538]"
              strokeWidth="7"
              fill="transparent"
            />
            {/* Progress ring in Sky Blue (#87CEEB) */}
            <circle
              cx="60"
              cy="60"
              r={radius}
              stroke="#87CEEB"
              strokeWidth="7"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-500 ease-linear"
            />
          </svg>

          {/* Center Digital Display */}
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-black tracking-tight text-[#1E293B] dark:text-[#F5F0E6] font-mono">
              {formatDuration(remainingSeconds)}
            </span>
            <span className="text-[10px] font-bold text-[#3A89A8] dark:text-[#87CEEB] uppercase">
              {isRunning ? 'Focusing' : 'Paused'}
            </span>
          </div>
        </div>

        {/* Progress Bar & Percentage */}
        <div className="w-full max-w-xs mt-2">
          <div className="flex items-center justify-between text-[10px] font-bold text-[#64748B] dark:text-[#A0AAB8] mb-1">
            <span>Progress: {progressPercent}%</span>
            <span>Target: {formatDuration(session.targetDurationSeconds)}</span>
          </div>
          <div className="w-full h-2 rounded-full bg-[#E8DEC9] dark:bg-[#333538] overflow-hidden">
            <div
              className="h-full bg-[#87CEEB] transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Session Controls: Play/Pause, Extend, End Early */}
        <div className="flex items-center gap-2.5 mt-4">
          {/* Pause / Resume Button: Sky Blue */}
          <button
            type="button"
            onClick={handleTogglePlayPause}
            className="px-5 py-2.5 rounded-xl bg-[#87CEEB] hover:bg-[#72BFDE] text-[#1E293B] text-xs font-black flex items-center gap-1.5 shadow-sm transition-transform active:scale-95 cursor-pointer"
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4 fill-[#1E293B]" />
                <span>Pause Timer</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-[#1E293B]" />
                <span>Resume Timer</span>
              </>
            )}
          </button>

          {/* End Early */}
          <button
            type="button"
            onClick={onEndEarly}
            className="px-3.5 py-2.5 rounded-xl border border-[#D5C9B3] dark:border-[#383A3D] bg-white dark:bg-[#181A1B] text-[#64748B] dark:text-[#A0AAB8] hover:text-red-500 hover:border-red-400 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <StopCircle className="w-4 h-4" />
            <span>Finish Early</span>
          </button>
        </div>

        {/* Quick Extend Buttons */}
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#E8DEC9] dark:border-[#333538] text-xs">
          <span className="text-[10px] font-bold text-[#64748B] dark:text-[#A0AAB8]">Extend:</span>
          <button
            onClick={() => handleExtend(5)}
            className="px-2 py-1 rounded-lg bg-white dark:bg-[#181A1B] border border-[#E8DEC9] dark:border-[#383A3D] text-[11px] font-bold hover:bg-[#87CEEB]/20 text-[#1E293B] dark:text-[#F5F0E6] cursor-pointer"
          >
            +5m
          </button>
          <button
            onClick={() => handleExtend(10)}
            className="px-2 py-1 rounded-lg bg-white dark:bg-[#181A1B] border border-[#E8DEC9] dark:border-[#383A3D] text-[11px] font-bold hover:bg-[#87CEEB]/20 text-[#1E293B] dark:text-[#F5F0E6] cursor-pointer"
          >
            +10m
          </button>
          <button
            onClick={() => handleExtend(15)}
            className="px-2 py-1 rounded-lg bg-white dark:bg-[#181A1B] border border-[#E8DEC9] dark:border-[#383A3D] text-[11px] font-bold hover:bg-[#87CEEB]/20 text-[#1E293B] dark:text-[#F5F0E6] cursor-pointer"
          >
            +15m
          </button>
        </div>
      </div>

      {/* Interactive App Blocker Simulator Shortcut */}
      <div className="bg-[#FAF7F2] dark:bg-[#202224] p-3 rounded-xl border border-[#E8DEC9] dark:border-[#2D3033] flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-[#3A89A8] dark:text-[#87CEEB]" />
          <div>
            <p className="font-bold text-[#1E293B] dark:text-[#F5F0E6] text-[11px]">
              Distraction Interceptor Test
            </p>
            <p className="text-[10px] text-[#64748B] dark:text-[#A0AAB8]">
              Simulate tapping a restricted app on device
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onOpenAppBlockerSim('Instagram')}
            className="px-2 py-1 rounded-lg bg-[#87CEEB]/20 text-[#1E293B] dark:text-[#87CEEB] text-[10px] font-bold hover:bg-[#87CEEB]/30 transition-colors cursor-pointer"
          >
            Test Instagram
          </button>
          <button
            type="button"
            onClick={() => onOpenAppBlockerSim('TikTok')}
            className="px-2 py-1 rounded-lg bg-[#87CEEB]/20 text-[#1E293B] dark:text-[#87CEEB] text-[10px] font-bold hover:bg-[#87CEEB]/30 transition-colors cursor-pointer"
          >
            Test TikTok
          </button>
        </div>
      </div>

      {/* Video Study Notes Scratchpad */}
      <div className="bg-[#FAF7F2] dark:bg-[#202224] p-3 rounded-xl border border-[#E8DEC9] dark:border-[#2D3033]">
        <button
          type="button"
          onClick={() => setShowNotes(!showNotes)}
          className="w-full flex items-center justify-between text-xs font-bold text-[#1E293B] dark:text-[#F5F0E6] cursor-pointer"
        >
          <span className="flex items-center gap-1.5">
            <Edit3 className="w-3.5 h-3.5 text-[#3A89A8] dark:text-[#87CEEB]" />
            Study Notes & Key Takeaways
          </span>
          <span className="text-[10px] font-semibold text-[#87CEEB]">
            {showNotes ? 'Hide' : 'Open'}
          </span>
        </button>

        {showNotes && (
          <div className="mt-2 animate-in fade-in">
            <textarea
              value={notesText}
              onChange={(e) => {
                setNotesText(e.target.value);
                onUpdateSession({ ...session, notes: e.target.value });
              }}
              placeholder="Jot down formulas, concepts, timestamps, and core insights from this video..."
              rows={3}
              className="w-full p-2.5 text-xs rounded-xl border border-[#D5C9B3] dark:border-[#383A3D] bg-white dark:bg-[#181A1B] text-[#1E293B] dark:text-white placeholder-[#94A3B8] focus:outline-hidden focus:border-[#87CEEB]"
            />
          </div>
        )}
      </div>

      {/* Video finished early dialog */}
      {videoEndedPrompt && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in">
          <div className="bg-[#FAF7F2] dark:bg-[#202224] max-w-sm w-full p-5 rounded-3xl border-2 border-[#87CEEB] shadow-2xl text-center space-y-3">
            <Mascot size="md" animate={true} className="mx-auto" />

            <h3 className="text-base font-extrabold text-[#1E293B] dark:text-[#F5F0E6]">
              Selected Video Finished!
            </h3>
            <p className="text-xs text-[#64748B] dark:text-[#A0AAB8]">
              You have completed watching this educational video. What would you like to do with the remaining time?
            </p>

            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setVideoEndedPrompt(false);
                  onCompleteSession('full');
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-[#87CEEB] hover:bg-[#72BFDE] text-[#1E293B] text-xs font-black shadow-xs cursor-pointer"
              >
                End Session & Save 100% Progress
              </button>

              <button
                type="button"
                onClick={() => {
                  setVideoEndedPrompt(false);
                  setShowNotes(true);
                }}
                className="w-full py-2.5 px-4 rounded-xl border border-[#D5C9B3] dark:border-[#383A3D] bg-white dark:bg-[#181A1B] text-[#1E293B] dark:text-white text-xs font-bold cursor-pointer"
              >
                Keep Timer Running & Review Notes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
