import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { FocusSession } from '../types';
import { formatDuration } from '../utils/youtube';
import { Mascot } from './Mascot';
import { CheckCircle, Trophy, Sparkles, ShieldCheck, Clock, ArrowRight, Star } from 'lucide-react';

interface SessionCompletionModalProps {
  session: FocusSession;
  onConfirmCompletion: (completedGoal: 'full' | 'partial' | 'review') => void;
}

export const SessionCompletionModal: React.FC<SessionCompletionModalProps> = ({
  session,
  onConfirmCompletion
}) => {
  const [selectedGoal, setSelectedGoal] = useState<'full' | 'partial' | 'review'>('full');

  useEffect(() => {
    // Fire celebratory confetti in Sky Blue and Gold/Beige colors
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#87CEEB', '#5EAED6', '#F5F0E6', '#E8DEC9', '#FFFFFF']
      });
    } catch {
      // ignore
    }
  }, []);

  const handleSave = () => {
    onConfirmCompletion(selectedGoal);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-[#FAF7F2] dark:bg-[#202224] max-w-sm w-full p-5 rounded-3xl border-2 border-[#87CEEB] shadow-2xl space-y-4">
        {/* Celebration Header with Mascot */}
        <div className="text-center space-y-1">
          <div className="relative inline-block mx-auto">
            <Mascot size="lg" animate={true} />
            <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-[#87CEEB] flex items-center justify-center shadow-xs">
              <Trophy className="w-4 h-4 text-[#1E293B]" />
            </div>
          </div>

          <h2 className="text-lg font-black text-[#1E293B] dark:text-[#F5F0E6] pt-1">
            Focus Session Completed!
          </h2>
          <p className="text-xs text-[#64748B] dark:text-[#A0AAB8]">
            Restricted apps are now restored and normal device access is unblocked.
          </p>
        </div>

        {/* Session Recap Card */}
        <div className="bg-white dark:bg-[#181A1B] p-3.5 rounded-2xl border border-[#E8DEC9] dark:border-[#383A3D] space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#1E293B] dark:text-[#F5F0E6] truncate">
            <Sparkles className="w-3.5 h-3.5 text-[#3A89A8] dark:text-[#87CEEB] shrink-0" />
            <span className="truncate">{session.video.title}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 text-center">
            <div className="p-2 rounded-xl bg-[#F5F0E6] dark:bg-[#242628] border border-[#E8DEC9]/50 dark:border-[#333538]">
              <span className="text-[10px] font-bold text-[#64748B] uppercase block">
                Focus Time
              </span>
              <span className="text-xs font-black text-[#1E293B] dark:text-[#F5F0E6] font-mono">
                {formatDuration(session.actualDurationSeconds || session.targetDurationSeconds)}
              </span>
            </div>

            <div className="p-2 rounded-xl bg-[#F5F0E6] dark:bg-[#242628] border border-[#E8DEC9]/50 dark:border-[#333538]">
              <span className="text-[10px] font-bold text-[#64748B] uppercase block">
                Shield Defense
              </span>
              <span className="text-xs font-black text-[#3A89A8] dark:text-[#87CEEB]">
                {session.distractionsPreventedCount} Blocked
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 pt-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{session.blockedApps.length} Apps Unblocked & Restored</span>
          </div>
        </div>

        {/* Video Completion Verification */}
        <div>
          <label className="block text-[11px] font-bold text-[#1E293B] dark:text-[#E8F6FC] mb-2 text-center">
            Did you finish your video study goal?
          </label>

          <div className="space-y-1.5">
            <button
              type="button"
              onClick={() => setSelectedGoal('full')}
              className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between text-xs font-bold transition-all cursor-pointer ${
                selectedGoal === 'full'
                  ? 'border-[#87CEEB] bg-[#87CEEB]/20 text-[#1E293B] dark:text-white'
                  : 'border-[#E8DEC9] dark:border-[#383A3D] bg-white dark:bg-[#181A1B] text-[#64748B]'
              }`}
            >
              <span>🎯 Yes, finished completely</span>
              {selectedGoal === 'full' && <CheckCircle className="w-4 h-4 text-[#3A89A8] dark:text-[#87CEEB]" />}
            </button>

            <button
              type="button"
              onClick={() => setSelectedGoal('partial')}
              className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between text-xs font-bold transition-all cursor-pointer ${
                selectedGoal === 'partial'
                  ? 'border-[#87CEEB] bg-[#87CEEB]/20 text-[#1E293B] dark:text-white'
                  : 'border-[#E8DEC9] dark:border-[#383A3D] bg-white dark:bg-[#181A1B] text-[#64748B]'
              }`}
            >
              <span>⏱️ Partially completed</span>
              {selectedGoal === 'partial' && <CheckCircle className="w-4 h-4 text-[#3A89A8] dark:text-[#87CEEB]" />}
            </button>

            <button
              type="button"
              onClick={() => setSelectedGoal('review')}
              className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between text-xs font-bold transition-all cursor-pointer ${
                selectedGoal === 'review'
                  ? 'border-[#87CEEB] bg-[#87CEEB]/20 text-[#1E293B] dark:text-white'
                  : 'border-[#E8DEC9] dark:border-[#383A3D] bg-white dark:bg-[#181A1B] text-[#64748B]'
              }`}
            >
              <span>📚 Finished, needs follow-up review</span>
              {selectedGoal === 'review' && <CheckCircle className="w-4 h-4 text-[#3A89A8] dark:text-[#87CEEB]" />}
            </button>
          </div>
        </div>

        {/* Primary Save Action */}
        <button
          type="button"
          onClick={handleSave}
          className="w-full py-3 px-4 rounded-xl bg-[#87CEEB] hover:bg-[#72BFDE] text-[#1E293B] text-xs font-black flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-transform active:scale-98"
        >
          <span>Save Session & View Statistics</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
