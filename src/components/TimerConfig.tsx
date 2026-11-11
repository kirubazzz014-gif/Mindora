import React, { useState } from 'react';
import { YouTubeVideoInfo } from '../types';
import { Clock, Timer, Sparkles, Check } from 'lucide-react';

interface TimerConfigProps {
  video: YouTubeVideoInfo;
  onDurationSelected: (totalSeconds: number) => void;
  initialSeconds?: number;
}

export const TimerConfig: React.FC<TimerConfigProps> = ({
  video,
  onDurationSelected,
  initialSeconds = 1800
}) => {
  const [hours, setHours] = useState(Math.floor(initialSeconds / 3600));
  const [minutes, setMinutes] = useState(Math.floor((initialSeconds % 3600) / 60));

  const totalSeconds = hours * 3600 + minutes * 60;

  const handleApplyPreset = (mins: number) => {
    setHours(Math.floor(mins / 60));
    setMinutes(mins % 60);
  };

  const handleMatchVideo = () => {
    if (video.durationSeconds > 0) {
      const mins = Math.max(1, Math.round(video.durationSeconds / 60));
      handleApplyPreset(mins);
    }
  };

  const handleConfirm = () => {
    if (totalSeconds >= 60) {
      onDurationSelected(totalSeconds);
    }
  };

  return (
    <div className="bg-[#FAF7F2] dark:bg-[#202224] p-4 rounded-2xl border border-[#E8DEC9] dark:border-[#2D3033] space-y-4">
      <div>
        <h3 className="text-sm font-bold text-[#1E293B] dark:text-[#F5F0E6] flex items-center gap-1.5">
          <Timer className="w-4 h-4 text-[#3A89A8] dark:text-[#87CEEB]" />
          Step 2: Set Focus Timer
        </h3>
        <p className="text-xs text-[#64748B] dark:text-[#A0AAB8] mt-0.5">
          Determine your dedicated study block. When time runs out, Mindora safely unlocks your apps.
        </p>
      </div>

      {/* Preset duration chips */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleMatchVideo}
          className="px-2.5 py-1.5 rounded-xl border border-[#87CEEB] bg-[#87CEEB]/20 text-[#1E293B] dark:text-[#E8F6FC] text-xs font-bold flex items-center gap-1 hover:bg-[#87CEEB]/30 transition-colors cursor-pointer"
        >
          <Sparkles className="w-3 h-3 text-[#3A89A8] dark:text-[#87CEEB]" />
          Match Video ({video.durationFormatted})
        </button>

        {[15, 25, 45, 60, 90].map((mins) => {
          const isSelected = totalSeconds === mins * 60;
          return (
            <button
              key={mins}
              type="button"
              onClick={() => handleApplyPreset(mins)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#87CEEB] text-[#1E293B] shadow-xs'
                  : 'border border-[#D5C9B3] dark:border-[#383A3D] bg-white dark:bg-[#181A1B] text-[#64748B] dark:text-[#A0AAB8] hover:border-[#87CEEB]'
              }`}
            >
              {mins < 60 ? `${mins}m` : `${mins / 60}h`}
            </button>
          );
        })}
      </div>

      {/* Custom Duration Selector */}
      <div className="bg-white dark:bg-[#181A1B] p-4 rounded-xl border border-[#E8DEC9] dark:border-[#333538] flex items-center justify-center gap-4">
        {/* Hours */}
        <div className="flex flex-col items-center">
          <label className="text-[10px] font-bold uppercase text-[#64748B] dark:text-[#A0AAB8] mb-1">
            Hours
          </label>
          <select
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            className="w-20 py-2 px-2 text-center text-lg font-black bg-[#F5F0E6] dark:bg-[#202224] rounded-xl border border-[#D5C9B3] dark:border-[#383A3D] text-[#1E293B] dark:text-white focus:outline-hidden focus:border-[#87CEEB]"
          >
            {[0, 1, 2, 3, 4, 5, 6].map((h) => (
              <option key={h} value={h}>
                {h}h
              </option>
            ))}
          </select>
        </div>

        <span className="text-2xl font-black text-[#87CEEB] pt-4">:</span>

        {/* Minutes */}
        <div className="flex flex-col items-center">
          <label className="text-[10px] font-bold uppercase text-[#64748B] dark:text-[#A0AAB8] mb-1">
            Minutes
          </label>
          <select
            value={minutes}
            onChange={(e) => setMinutes(Number(e.target.value))}
            className="w-20 py-2 px-2 text-center text-lg font-black bg-[#F5F0E6] dark:bg-[#202224] rounded-xl border border-[#D5C9B3] dark:border-[#383A3D] text-[#1E293B] dark:text-white focus:outline-hidden focus:border-[#87CEEB]"
          >
            {[1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map((m) => (
              <option key={m} value={m}>
                {m}m
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Target Summary */}
      <div className="flex items-center justify-between text-xs px-1">
        <span className="text-[#64748B] dark:text-[#A0AAB8] font-medium flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-[#3A89A8] dark:text-[#87CEEB]" />
          Target Focus Time:
        </span>
        <span className="font-extrabold text-[#1E293B] dark:text-[#F5F0E6]">
          {hours > 0 ? `${hours} hr ` : ''}{minutes} min ({totalSeconds / 60} minutes)
        </span>
      </div>

      <button
        type="button"
        onClick={handleConfirm}
        className="w-full py-2.5 px-4 rounded-xl bg-[#87CEEB] hover:bg-[#72BFDE] text-[#1E293B] text-xs font-black flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-colors"
      >
        <Check className="w-4 h-4" />
        <span>Confirm Timer ({hours > 0 ? `${hours}h ` : ''}{minutes}m)</span>
      </button>
    </div>
  );
};
