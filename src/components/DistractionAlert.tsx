import React from 'react';
import { ShieldAlert, ArrowLeft, Lock, Smartphone, Timer } from 'lucide-react';
import { formatDuration } from '../utils/youtube';

interface DistractionAlertProps {
  appName: string;
  videoTitle: string;
  remainingSeconds: number;
  onReturnToMindora: () => void;
}

export const DistractionAlert: React.FC<DistractionAlertProps> = ({
  appName,
  videoTitle,
  remainingSeconds,
  onReturnToMindora
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-[#121417]/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
      {/* Android Interception Window */}
      <div className="bg-[#FAF7F2] dark:bg-[#1E2022] max-w-sm w-full p-6 rounded-3xl border-2 border-[#87CEEB] shadow-2xl text-center space-y-4">
        {/* Blocker Icon */}
        <div className="w-16 h-16 mx-auto rounded-3xl bg-[#87CEEB] flex items-center justify-center shadow-lg animate-bounce">
          <ShieldAlert className="w-8 h-8 text-[#1E293B]" />
        </div>

        <div>
          <span className="text-[10px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
            Android Focus Guard Active
          </span>
          <h2 className="text-lg font-black text-[#1E293B] dark:text-[#F5F0E6] mt-2">
            {appName} is Blocked!
          </h2>
          <p className="text-xs text-[#64748B] dark:text-[#A0AAB8] mt-1 leading-relaxed">
            Mindora intercepted your attempt to open <span className="font-bold text-[#1E293B] dark:text-white">{appName}</span> to preserve your deep study session.
          </p>
        </div>

        {/* Current Active Session Status */}
        <div className="bg-white dark:bg-[#151718] p-3 rounded-2xl border border-[#E8DEC9] dark:border-[#2D3033] text-left space-y-1.5">
          <p className="text-[10px] uppercase font-bold text-[#64748B] flex items-center gap-1">
            <Lock className="w-3 h-3 text-[#3A89A8] dark:text-[#87CEEB]" />
            Locked to Educational Video:
          </p>
          <p className="text-xs font-bold text-[#1E293B] dark:text-[#F5F0E6] truncate">
            {videoTitle}
          </p>
          <div className="flex items-center justify-between text-[11px] font-semibold text-[#3A89A8] dark:text-[#87CEEB] pt-1">
            <span className="flex items-center gap-1">
              <Timer className="w-3.5 h-3.5" />
              Focus Remaining:
            </span>
            <span className="font-mono font-bold text-[#1E293B] dark:text-[#F5F0E6]">
              {formatDuration(remainingSeconds)}
            </span>
          </div>
        </div>

        <div className="text-[10px] text-[#64748B] dark:text-[#8E97A6]">
          Android Mechanism: Intercepted via <code className="bg-[#E8DEC9]/50 dark:bg-[#2A2C2E] px-1 py-0.5 rounded font-mono">android.permission.PACKAGE_USAGE_STATS</code> and overlay shield.
        </div>

        {/* Primary Return Button: Sky Blue */}
        <button
          type="button"
          onClick={onReturnToMindora}
          className="w-full py-3 px-4 rounded-xl bg-[#87CEEB] hover:bg-[#72BFDE] text-[#1E293B] text-xs font-black flex items-center justify-center gap-2 shadow-md cursor-pointer transition-transform active:scale-98"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Mindora Video Player</span>
        </button>
      </div>
    </div>
  );
};
