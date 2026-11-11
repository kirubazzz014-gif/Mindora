import React from 'react';
import { useAuth } from '../context/AuthContext';
import { storage } from '../utils/storage';
import { formatDuration } from '../utils/youtube';
import { Mascot } from './Mascot';
import {
  Flame,
  Clock,
  CheckCircle2,
  ShieldAlert,
  Calendar,
  Sparkles,
  TrendingUp,
  RotateCcw
} from 'lucide-react';

interface StatsViewProps {
  onStartNewSession: () => void;
}

export const StatsView: React.FC<StatsViewProps> = ({ onStartNewSession }) => {
  const { user } = useAuth();
  const stats = storage.getStats(user?.id);
  const history = storage.getSessionHistory(user?.id);

  const totalHours = (stats.totalFocusSeconds / 3600).toFixed(1);

  // Maximum value for weekly chart normalization
  const maxWeeklyMins = Math.max(1, ...stats.weeklyMinutes.map((d) => d.minutes));

  return (
    <div className="space-y-4 p-1">
      {/* Mascot Mindora Growth Banner */}
      <div className="bg-[#FAF7F2] dark:bg-[#202224] p-3.5 rounded-2xl border border-[#E8DEC9] dark:border-[#2D3033] flex items-center justify-between shadow-xs">
        <div>
          <span className="text-[10px] font-black uppercase text-[#87CEEB] tracking-wider">
            Mindora Learning Journey
          </span>
          <h2 className="text-sm font-black text-[#1E293B] dark:text-[#F5F0E6] mt-0.5">
            Focus. Learn. Grow.
          </h2>
          <p className="text-[11px] text-[#64748B] dark:text-[#A0AAB8] mt-0.5">
            {stats.sessionsCompleted > 0
              ? `You've conquered ${stats.sessionsCompleted} video sessions!`
              : 'Every minute of focused study compounds into mastery.'}
          </p>
        </div>
        <Mascot size="sm" animate={true} />
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Total Hours */}
        <div className="bg-[#FAF7F2] dark:bg-[#202224] p-3 rounded-2xl border border-[#E8DEC9] dark:border-[#2D3033]">
          <div className="flex items-center gap-1.5 text-xs text-[#64748B] dark:text-[#A0AAB8] font-bold">
            <Clock className="w-4 h-4 text-[#3A89A8] dark:text-[#87CEEB]" />
            <span>Total Focus</span>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-xl font-black text-[#1E293B] dark:text-[#F5F0E6]">
              {totalHours}
            </span>
            <span className="text-xs font-semibold text-[#64748B]">hours</span>
          </div>
        </div>

        {/* Current Streak */}
        <div className="bg-[#FAF7F2] dark:bg-[#202224] p-3 rounded-2xl border border-[#E8DEC9] dark:border-[#2D3033]">
          <div className="flex items-center gap-1.5 text-xs text-[#64748B] dark:text-[#A0AAB8] font-bold">
            <Flame className="w-4 h-4 text-amber-500" />
            <span>Study Streak</span>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-xl font-black text-[#1E293B] dark:text-[#F5F0E6]">
              {stats.currentStreakDays}
            </span>
            <span className="text-xs font-semibold text-[#64748B]">days</span>
          </div>
        </div>

        {/* Completed Sessions */}
        <div className="bg-[#FAF7F2] dark:bg-[#202224] p-3 rounded-2xl border border-[#E8DEC9] dark:border-[#2D3033]">
          <div className="flex items-center gap-1.5 text-xs text-[#64748B] dark:text-[#A0AAB8] font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Completed</span>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-xl font-black text-[#1E293B] dark:text-[#F5F0E6]">
              {stats.sessionsCompleted}
            </span>
            <span className="text-xs font-semibold text-[#64748B]">videos</span>
          </div>
        </div>

        {/* Distractions Prevented */}
        <div className="bg-[#FAF7F2] dark:bg-[#202224] p-3 rounded-2xl border border-[#E8DEC9] dark:border-[#2D3033]">
          <div className="flex items-center gap-1.5 text-xs text-[#64748B] dark:text-[#A0AAB8] font-bold">
            <ShieldAlert className="w-4 h-4 text-[#3A89A8] dark:text-[#87CEEB]" />
            <span>Shield Stops</span>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-xl font-black text-[#1E293B] dark:text-[#F5F0E6]">
              {stats.distractionsBlockedTotal}
            </span>
            <span className="text-xs font-semibold text-[#64748B]">distractions</span>
          </div>
        </div>
      </div>

      {/* Weekly Focus Bar Chart */}
      <div className="bg-[#FAF7F2] dark:bg-[#202224] p-4 rounded-2xl border border-[#E8DEC9] dark:border-[#2D3033]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-[#1E293B] dark:text-[#F5F0E6] flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-[#3A89A8] dark:text-[#87CEEB]" />
            Weekly Focus Minutes
          </span>
          <span className="text-[10px] font-semibold text-[#64748B]">Past 7 Days</span>
        </div>

        <div className="flex items-end justify-between h-28 pt-2 px-1 gap-2">
          {stats.weeklyMinutes.map((item, idx) => {
            const heightPercent = Math.max(12, Math.round((item.minutes / maxWeeklyMins) * 100));
            const hasData = item.minutes > 0;
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <span className="text-[9px] font-mono font-bold text-[#64748B] dark:text-[#A0AAB8]">
                  {item.minutes > 0 ? `${item.minutes}m` : '-'}
                </span>
                <div className="w-full bg-[#E8DEC9] dark:bg-[#333538] rounded-t-lg h-20 flex items-end overflow-hidden">
                  <div
                    className={`w-full transition-all duration-500 rounded-t-lg ${
                      hasData ? 'bg-[#87CEEB]' : 'bg-transparent'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>
                <span className="text-[10px] font-bold text-[#64748B] dark:text-[#A0AAB8]">
                  {item.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Session History List */}
      <div className="bg-[#FAF7F2] dark:bg-[#202224] p-4 rounded-2xl border border-[#E8DEC9] dark:border-[#2D3033]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-[#1E293B] dark:text-[#F5F0E6] flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-[#3A89A8] dark:text-[#87CEEB]" />
            Recent 1-Video Sessions ({history.length})
          </span>
          <button
            onClick={onStartNewSession}
            className="text-[11px] font-bold text-[#3A89A8] dark:text-[#87CEEB] hover:underline cursor-pointer"
          >
            + New Session
          </button>
        </div>

        {history.length === 0 ? (
          <div className="text-center py-6 text-xs text-[#64748B] dark:text-[#A0AAB8]">
            <p>No completed focus sessions yet.</p>
            <p className="mt-1">Pick your educational video and start your first session!</p>
          </div>
        ) : (
          <div className="space-y-2 mt-2 max-h-56 overflow-y-auto pr-1">
            {history.map((s) => (
              <div
                key={s.id}
                className="p-2.5 rounded-xl border border-[#E8DEC9]/60 dark:border-[#383A3D] bg-white dark:bg-[#181A1B] flex items-center gap-2.5"
              >
                <img
                  src={s.video.thumbnailUrl}
                  alt={s.video.title}
                  className="w-12 h-8 rounded-lg object-cover shrink-0 bg-black"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold text-[#1E293B] dark:text-[#F5F0E6] truncate">
                    {s.video.title}
                  </p>
                  <p className="text-[10px] text-[#64748B] dark:text-[#A0AAB8]">
                    {formatDuration(s.actualDurationSeconds || s.targetDurationSeconds)} ·{' '}
                    {new Date(s.startedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <span className="inline-block px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#87CEEB]/20 text-[#1E293B] dark:text-[#87CEEB]">
                    {s.completedGoal === 'full' ? 'Completed' : 'Focused'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Start New Session CTA */}
      <button
        type="button"
        onClick={onStartNewSession}
        className="w-full py-3 px-4 rounded-xl bg-[#87CEEB] hover:bg-[#72BFDE] text-[#1E293B] text-xs font-black flex items-center justify-center gap-2 shadow-md cursor-pointer transition-transform active:scale-98"
      >
        <Sparkles className="w-4 h-4" />
        <span>Start New Focus Video</span>
      </button>
    </div>
  );
};
