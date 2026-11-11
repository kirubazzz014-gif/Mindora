import React, { useState } from 'react';
import { AppBlockItem } from '../types';
import { storage } from '../utils/storage';
import { ShieldCheck, ShieldAlert, Check, HelpCircle, Lock, Smartphone, RefreshCw } from 'lucide-react';

interface AppBlockerConfigProps {
  onConfirmApps: (blockedAppIds: string[]) => void;
  onOpenPermissionsModal: () => void;
  isStandaloneTab?: boolean;
}

export const AppBlockerConfig: React.FC<AppBlockerConfigProps> = ({
  onConfirmApps,
  onOpenPermissionsModal,
  isStandaloneTab = false
}) => {
  const [apps, setApps] = useState<AppBlockItem[]>(() => storage.getBlockedApps());
  const permissions = storage.getPermissions();

  const handleToggleApp = (id: string) => {
    const updated = apps.map(app => {
      if (app.id === id) {
        return { ...app, isBlocked: !app.isBlocked };
      }
      return app;
    });
    setApps(updated);
    storage.saveBlockedApps(updated);
  };

  const handleSelectAll = (blocked: boolean) => {
    const updated = apps.map(app => ({ ...app, isBlocked: blocked }));
    setApps(updated);
    storage.saveBlockedApps(updated);
  };

  const blockedCount = apps.filter(a => a.isBlocked).length;

  const handleStart = () => {
    const blockedIds = apps.filter(a => a.isBlocked).map(a => a.id);
    onConfirmApps(blockedIds);
  };

  return (
    <div className="bg-[#FAF7F2] dark:bg-[#202224] p-4 rounded-2xl border border-[#E8DEC9] dark:border-[#2D3033] space-y-4">
      {/* Title & Explainer */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-bold text-[#1E293B] dark:text-[#F5F0E6] flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#3A89A8] dark:text-[#87CEEB]" />
            {isStandaloneTab ? 'Mindora Smart App Blocker' : 'Step 3: Select Distracting Apps to Block'}
          </h3>
          <p className="text-xs text-[#64748B] dark:text-[#A0AAB8] mt-0.5">
            Choose which mobile apps Mindora should intercept during your video session.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenPermissionsModal}
          className="text-[11px] font-bold text-[#3A89A8] dark:text-[#87CEEB] flex items-center gap-1 hover:underline cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Android APIs</span>
        </button>
      </div>

      {/* Android Permissions Banner */}
      <div className="p-2.5 rounded-xl bg-white dark:bg-[#181A1B] border border-[#E8DEC9] dark:border-[#383A3D] flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <div>
            <p className="font-bold text-[#1E293B] dark:text-[#F5F0E6] text-[11px]">
              Android Shield: Active
            </p>
            <p className="text-[10px] text-[#64748B] dark:text-[#A0AAB8]">
              UsageStats + Overlay window enabled
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenPermissionsModal}
          className="px-2 py-1 rounded-lg bg-[#87CEEB]/20 text-[#1E293B] dark:text-[#87CEEB] text-[10px] font-bold hover:bg-[#87CEEB]/30 transition-colors cursor-pointer"
        >
          Verify
        </button>
      </div>

      {/* Select All / Deselect All Controls */}
      <div className="flex items-center justify-between text-xs font-semibold px-1">
        <span className="text-[#1E293B] dark:text-[#F5F0E6] text-[11px]">
          {blockedCount} of {apps.length} apps restricted
        </span>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleSelectAll(true)}
            className="text-[11px] text-[#3A89A8] dark:text-[#87CEEB] hover:underline cursor-pointer"
          >
            Block All
          </button>
          <span className="text-[#CBD5E1]">·</span>
          <button
            type="button"
            onClick={() => handleSelectAll(false)}
            className="text-[11px] text-[#64748B] dark:text-[#A0AAB8] hover:underline cursor-pointer"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* App List */}
      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
        {apps.map((app) => {
          return (
            <div
              key={app.id}
              onClick={() => handleToggleApp(app.id)}
              className={`p-2.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer select-none ${
                app.isBlocked
                  ? 'border-[#87CEEB] bg-[#87CEEB]/10'
                  : 'border-[#E8DEC9]/70 dark:border-[#333538] bg-white dark:bg-[#181A1B] opacity-75 hover:opacity-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl shrink-0">{app.icon}</span>
                <div>
                  <p className="text-xs font-bold text-[#1E293B] dark:text-[#F5F0E6]">
                    {app.name}
                  </p>
                  <p className="text-[10px] text-[#64748B] dark:text-[#A0AAB8] font-mono">
                    {app.packageName}
                  </p>
                </div>
              </div>

              {/* Toggle switch styled in Sky Blue */}
              <div
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out ${
                  app.isBlocked ? 'bg-[#87CEEB]' : 'bg-[#D1D5DB] dark:bg-[#4B5563]'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                    app.isBlocked ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>

      {!isStandaloneTab && (
        <button
          type="button"
          onClick={handleStart}
          className="w-full py-3 px-4 rounded-xl bg-[#87CEEB] hover:bg-[#72BFDE] text-[#1E293B] text-xs font-black flex items-center justify-center gap-2 shadow-md cursor-pointer transition-transform active:scale-98"
        >
          <Lock className="w-4 h-4" />
          <span>Launch Deep Focus Session</span>
        </button>
      )}
    </div>
  );
};
