import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Mascot } from './Mascot';
import { ShieldCheck, BarChart3, Video, LogOut } from 'lucide-react';

interface HeaderProps {
  currentTab: 'focus' | 'blocker' | 'stats';
  onSelectTab: (tab: 'focus' | 'blocker' | 'stats') => void;
  isSessionActive: boolean;
  onOpenPermissionsGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  isSessionActive
}) => {
  const { user, logout } = useAuth();

  return (
    <header className="w-full bg-[#F5F0E6] dark:bg-[#181A1B] border-b border-[#E8DEC9] dark:border-[#2C2E30] px-4 py-2.5 sticky top-0 z-30 transition-colors">
      <div className="flex items-center justify-between">
        {/* Brand identity with official Mascot */}
        <div className="flex items-center gap-2.5">
          <Mascot size="xs" animate={true} />
          <div>
            <h1 className="text-sm sm:text-base font-black tracking-tight text-[#1E293B] dark:text-[#F5F0E6] leading-none flex items-center gap-1.5">
              Mindora
              {isSessionActive && (
                <span className="flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#87CEEB] text-[#1E293B] animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1E293B]" />
                  FOCUS ACTIVE
                </span>
              )}
            </h1>
            <p className="text-[10px] text-[#3A89A8] dark:text-[#87CEEB] font-bold tracking-wide mt-0.5">
              Focus. Learn. Grow.
            </p>
          </div>
        </div>

        {/* User profile & Actions */}
        <div className="flex items-center gap-2">
          {user && (
            <div className="flex items-center gap-1.5">
              <span className="hidden sm:inline text-xs font-bold text-[#1E293B] dark:text-[#EDE7D9] truncate max-w-[120px]">
                {user.name.split(' ')[0]}
              </span>
              <img
                src={user.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.email}&backgroundColor=87ceeb`}
                alt={user.name}
                className="w-7 h-7 rounded-full border border-[#87CEEB] bg-white object-cover"
              />
              <button
                onClick={logout}
                title="Log out of Mindora"
                className="p-1 text-[#64748B] hover:text-[#1E293B] dark:hover:text-[#F5F0E6] rounded-lg hover:bg-[#87CEEB]/20 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Navigation tabs */}
      {!isSessionActive && (
        <nav className="flex items-center justify-around mt-2.5 pt-2 border-t border-[#E8DEC9]/60 dark:border-[#2C2E30]/60">
          <button
            onClick={() => onSelectTab('focus')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              currentTab === 'focus'
                ? 'bg-[#87CEEB] text-[#1E293B] shadow-xs'
                : 'text-[#64748B] dark:text-[#A0AAB8] hover:bg-[#E8DEC9]/50 dark:hover:bg-[#252729]'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>1-Video Focus</span>
          </button>

          <button
            onClick={() => onSelectTab('blocker')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              currentTab === 'blocker'
                ? 'bg-[#87CEEB] text-[#1E293B] shadow-xs'
                : 'text-[#64748B] dark:text-[#A0AAB8] hover:bg-[#E8DEC9]/50 dark:hover:bg-[#252729]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>App Blocker</span>
          </button>

          <button
            onClick={() => onSelectTab('stats')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              currentTab === 'stats'
                ? 'bg-[#87CEEB] text-[#1E293B] shadow-xs'
                : 'text-[#64748B] dark:text-[#A0AAB8] hover:bg-[#E8DEC9]/50 dark:hover:bg-[#252729]'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Streaks</span>
          </button>
        </nav>
      )}
    </header>
  );
};
