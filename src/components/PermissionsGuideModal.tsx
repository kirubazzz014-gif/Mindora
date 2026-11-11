import React, { useState } from 'react';
import { storage } from '../utils/storage';
import { AndroidPermissionState } from '../types';
import { ShieldCheck, Check, X, Smartphone, Layers, Eye, BellOff, Info } from 'lucide-react';

interface PermissionsGuideModalProps {
  onClose: () => void;
}

export const PermissionsGuideModal: React.FC<PermissionsGuideModalProps> = ({ onClose }) => {
  const [perms, setPerms] = useState<AndroidPermissionState>(() => storage.getPermissions());

  const handleToggle = (key: keyof AndroidPermissionState) => {
    const updated = {
      ...perms,
      [key]: !perms[key]
    };
    setPerms(updated);
    storage.savePermissions(updated);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-[#FAF7F2] dark:bg-[#1E2022] max-w-md w-full p-5 rounded-3xl border-2 border-[#87CEEB] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#87CEEB] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#1E293B]" />
            </div>
            <div>
              <h2 className="text-base font-black text-[#1E293B] dark:text-[#F5F0E6]">
                Android App Blocking Architecture
              </h2>
              <p className="text-[11px] text-[#64748B] dark:text-[#A0AAB8]">
                Transparent permission controls & system capabilities
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#E8DEC9] dark:hover:bg-[#2F3133] text-[#64748B] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Technical Explainer */}
        <div className="p-3 rounded-2xl bg-white dark:bg-[#151718] border border-[#E8DEC9] dark:border-[#2D3033] text-xs text-[#1E293B] dark:text-[#EDE7D9] space-y-1.5 leading-relaxed">
          <div className="flex items-center gap-1.5 font-bold text-[#3A89A8] dark:text-[#87CEEB]">
            <Info className="w-3.5 h-3.5" />
            <span>How Mindora Restricts Apps on Android</span>
          </div>
          <p className="text-[11px] text-[#64748B] dark:text-[#A0AAB8]">
            Mindora uses native Android APIs to monitor foreground packages. When you launch a blocked app (like Instagram or TikTok), Mindora displays an impenetrable overlay shield, keeping your attention locked on your chosen educational video.
          </p>
        </div>

        {/* 4 Android Capabilities */}
        <div className="space-y-2.5">
          {/* Permission 1: Usage Access */}
          <div className="p-3 rounded-xl bg-white dark:bg-[#151718] border border-[#E8DEC9] dark:border-[#2D3033] flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-xs text-[#1E293B] dark:text-[#F5F0E6]">
                <Eye className="w-3.5 h-3.5 text-[#3A89A8] dark:text-[#87CEEB]" />
                <span>1. Usage Access (UsageStatsManager)</span>
              </div>
              <p className="text-[10px] text-[#64748B] dark:text-[#A0AAB8] font-mono">
                android.permission.PACKAGE_USAGE_STATS
              </p>
              <p className="text-[11px] text-[#64748B] dark:text-[#A0AAB8]">
                Allows Mindora to inspect which app is actively in the foreground to detect when Instagram or TikTok opens.
              </p>
            </div>

            <button
              onClick={() => handleToggle('usageAccessGranted')}
              className={`shrink-0 px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                perms.usageAccessGranted
                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                  : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-500'
              }`}
            >
              {perms.usageAccessGranted ? 'Granted' : 'Enable'}
            </button>
          </div>

          {/* Permission 2: Draw Over Other Apps */}
          <div className="p-3 rounded-xl bg-white dark:bg-[#151718] border border-[#E8DEC9] dark:border-[#2D3033] flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-xs text-[#1E293B] dark:text-[#F5F0E6]">
                <Layers className="w-3.5 h-3.5 text-[#3A89A8] dark:text-[#87CEEB]" />
                <span>2. Display Over Other Apps (Overlay Window)</span>
              </div>
              <p className="text-[10px] text-[#64748B] dark:text-[#A0AAB8] font-mono">
                android.permission.SYSTEM_ALERT_WINDOW
              </p>
              <p className="text-[11px] text-[#64748B] dark:text-[#A0AAB8]">
                Required to render the Mindora Focus Blocker directly on top of distracting applications to intercept access.
              </p>
            </div>

            <button
              onClick={() => handleToggle('overlayGranted')}
              className={`shrink-0 px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                perms.overlayGranted
                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                  : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-500'
              }`}
            >
              {perms.overlayGranted ? 'Granted' : 'Enable'}
            </button>
          </div>

          {/* Permission 3: Accessibility Service */}
          <div className="p-3 rounded-xl bg-white dark:bg-[#151718] border border-[#E8DEC9] dark:border-[#2D3033] flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-xs text-[#1E293B] dark:text-[#F5F0E6]">
                <Smartphone className="w-3.5 h-3.5 text-[#3A89A8] dark:text-[#87CEEB]" />
                <span>3. Accessibility Window Monitor</span>
              </div>
              <p className="text-[10px] text-[#64748B] dark:text-[#A0AAB8] font-mono">
                android.accessibilityservice.AccessibilityService
              </p>
              <p className="text-[11px] text-[#64748B] dark:text-[#A0AAB8]">
                Provides real-time event-driven notification when the user taps app switcher or home gesture.
              </p>
            </div>

            <button
              onClick={() => handleToggle('accessibilityGranted')}
              className={`shrink-0 px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                perms.accessibilityGranted
                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                  : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-500'
              }`}
            >
              {perms.accessibilityGranted ? 'Granted' : 'Enable'}
            </button>
          </div>

          {/* Permission 4: Do Not Disturb Policy */}
          <div className="p-3 rounded-xl bg-white dark:bg-[#151718] border border-[#E8DEC9] dark:border-[#2D3033] flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-xs text-[#1E293B] dark:text-[#F5F0E6]">
                <BellOff className="w-3.5 h-3.5 text-[#3A89A8] dark:text-[#87CEEB]" />
                <span>4. Do Not Disturb Notification Policy</span>
              </div>
              <p className="text-[10px] text-[#64748B] dark:text-[#A0AAB8] font-mono">
                android.permission.ACCESS_NOTIFICATION_POLICY
              </p>
              <p className="text-[11px] text-[#64748B] dark:text-[#A0AAB8]">
                Suppresses push notifications from Instagram and WhatsApp while you are watching your educational video.
              </p>
            </div>

            <button
              onClick={() => handleToggle('notificationPolicyGranted')}
              className={`shrink-0 px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                perms.notificationPolicyGranted
                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                  : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-500'
              }`}
            >
              {perms.notificationPolicyGranted ? 'Granted' : 'Enable'}
            </button>
          </div>
        </div>

        {/* Done Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 px-4 rounded-xl bg-[#87CEEB] hover:bg-[#72BFDE] text-[#1E293B] text-xs font-black shadow-sm cursor-pointer transition-colors"
        >
          Close & Save Permissions
        </button>
      </div>
    </div>
  );
};
