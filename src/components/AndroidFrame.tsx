import React, { useState, useEffect } from 'react';
import { Wifi, BatteryMedium, Signal, Smartphone, Monitor, Moon, Sun } from 'lucide-react';
import { storage } from '../utils/storage';

interface AndroidFrameProps {
  children: React.ReactNode;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({ children, isDark, onToggleTheme }) => {
  const [viewMode, setViewMode] = useState<'android-frame' | 'fullscreen'>(() => storage.getViewMode());
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleViewMode = () => {
    const nextMode = viewMode === 'android-frame' ? 'fullscreen' : 'android-frame';
    setViewMode(nextMode);
    storage.saveViewMode(nextMode);
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      isDark ? 'bg-[#151617] text-[#EDE7D9]' : 'bg-[#EFE8DC] text-[#1E293B]'
    } flex flex-col items-center justify-start p-0 sm:p-4 md:p-6 overflow-x-hidden`}>
      
      {/* Top Utility Controls Bar */}
      <header className="w-full max-w-5xl flex items-center justify-between py-2 px-4 mb-2 text-xs font-medium z-30">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#87CEEB] animate-pulse" />
          <span className="font-bold tracking-wider uppercase text-[#1E293B] dark:text-[#E8F6FC]">
            Mindora Android Edition
          </span>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] bg-[#87CEEB]/20 text-[#3A89A8] dark:text-[#87CEEB] font-semibold">
            v2.4 Focus Guard Active
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Frame / Fullscreen Switcher */}
          <button
            onClick={handleToggleViewMode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D5C9B3] dark:border-[#383A3D] bg-[#F5F0E6] dark:bg-[#202224] text-[#1E293B] dark:text-[#EDE7D9] hover:bg-[#87CEEB]/20 transition-all cursor-pointer shadow-xs"
            title="Toggle Android Device Mockup Frame"
          >
            {viewMode === 'android-frame' ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-[#3A89A8] dark:text-[#87CEEB]" />
                <span className="hidden sm:inline">Expanded View</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-[#3A89A8] dark:text-[#87CEEB]" />
                <span className="hidden sm:inline">Android Frame</span>
              </>
            )}
          </button>

          {/* Theme Switcher */}
          <button
            onClick={onToggleTheme}
            className="p-1.5 rounded-lg border border-[#D5C9B3] dark:border-[#383A3D] bg-[#F5F0E6] dark:bg-[#202224] text-[#1E293B] dark:text-[#EDE7D9] hover:bg-[#87CEEB]/20 transition-all cursor-pointer shadow-xs"
            title="Toggle Light/Dark Theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-[#87CEEB]" /> : <Moon className="w-4 h-4 text-[#1E293B]" />}
          </button>
        </div>
      </header>

      {/* Main Content Viewport */}
      {viewMode === 'android-frame' ? (
        <div className="relative w-full max-w-[430px] my-auto">
          {/* Outer Android Phone Hardware Bezel */}
          <div className="relative rounded-[48px] p-[10px] bg-[#1E232A] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35),0_0_0_1px_rgba(255,255,255,0.08)] border-4 border-[#2D333B]">
            
            {/* Phone Buttons (Decorative) */}
            <div className="absolute -left-[14px] top-28 w-[4px] h-12 bg-[#2D333B] rounded-l-md" />
            <div className="absolute -left-[14px] top-44 w-[4px] h-12 bg-[#2D333B] rounded-l-md" />
            <div className="absolute -right-[14px] top-32 w-[4px] h-16 bg-[#2D333B] rounded-r-md" />

            {/* Inner Phone Display */}
            <div className={`relative w-full rounded-[40px] overflow-hidden flex flex-col ${
              isDark ? 'bg-[#181A1B]' : 'bg-[#F5F0E6]'
            }`} style={{ height: '860px', maxHeight: 'calc(100vh - 80px)' }}>

              {/* Android Status Bar */}
              <div className={`w-full h-9 flex items-center justify-between px-6 pt-1 select-none z-40 text-xs font-semibold ${
                isDark ? 'bg-[#181A1B] text-[#EDE7D9]' : 'bg-[#F5F0E6] text-[#1E293B]'
              }`}>
                <span className="tracking-tight">{currentTime || '12:00'}</span>
                
                {/* Punch-hole camera */}
                <div className="w-3.5 h-3.5 rounded-full bg-black mx-auto ring-1 ring-white/10" />

                <div className="flex items-center gap-1.5 opacity-90">
                  <Signal className="w-3 h-3" />
                  <Wifi className="w-3.5 h-3.5" />
                  <div className="flex items-center gap-0.5">
                    <span className="text-[10px]">98%</span>
                    <BatteryMedium className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* Android Scrollable App Canvas */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col">
                {children}
              </div>

              {/* Android Gesture Bar */}
              <div className={`w-full h-5 flex items-center justify-center select-none py-1 z-40 ${
                isDark ? 'bg-[#181A1B]' : 'bg-[#F5F0E6]'
              }`}>
                <div className="w-32 h-1 bg-[#87CEEB]/50 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Fullscreen Web Container with max width constraint for clean responsive layout */
        <main className={`w-full max-w-4xl rounded-2xl shadow-lg border border-[#E3D9C3] dark:border-[#2D3033] overflow-hidden flex flex-col ${
          isDark ? 'bg-[#181A1B]' : 'bg-[#F5F0E6]'
        }`} style={{ minHeight: 'calc(100vh - 100px)' }}>
          {children}
        </main>
      )}
    </div>
  );
};
