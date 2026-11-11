import { User, FocusSession, AppBlockItem, FocusStats, AndroidPermissionState } from '../types';

const STORAGE_KEYS = {
  CURRENT_USER: 'mindora_current_user',
  USERS_LIST: 'mindora_registered_users',
  ACTIVE_SESSION: 'mindora_active_session',
  SESSION_HISTORY: 'mindora_session_history',
  BLOCKED_APPS: 'mindora_blocked_apps',
  PERMISSIONS: 'mindora_android_permissions',
  STATS: 'mindora_focus_stats',
  THEME_MODE: 'mindora_theme_mode',
  VIEW_MODE: 'mindora_view_mode', // 'android-frame' | 'fullscreen'
};

export const DEFAULT_BLOCKABLE_APPS: AppBlockItem[] = [
  { id: 'insta', name: 'Instagram', packageName: 'com.instagram.android', icon: '📸', category: 'social', isBlocked: true, attemptCountDuringSession: 0 },
  { id: 'tiktok', name: 'TikTok', packageName: 'com.zhiliaoapp.musically', icon: '🎵', category: 'video', isBlocked: true, attemptCountDuringSession: 0 },
  { id: 'snap', name: 'Snapchat', packageName: 'com.snapchat.android', icon: '👻', category: 'social', isBlocked: true, attemptCountDuringSession: 0 },
  { id: 'fb', name: 'Facebook', packageName: 'com.facebook.katana', icon: '👥', category: 'social', isBlocked: true, attemptCountDuringSession: 0 },
  { id: 'wa', name: 'WhatsApp', packageName: 'com.whatsapp', icon: '💬', category: 'messaging', isBlocked: false, attemptCountDuringSession: 0 },
  { id: 'yt_browse', name: 'YouTube Browse / Feed', packageName: 'com.google.android.youtube', icon: '📺', category: 'video', isBlocked: true, attemptCountDuringSession: 0 },
  { id: 'reddit', name: 'Reddit', packageName: 'com.reddit.frontpage', icon: '🤖', category: 'social', isBlocked: true, attemptCountDuringSession: 0 },
  { id: 'twitter', name: 'X (Twitter)', packageName: 'com.twitter.android', icon: '🐦', category: 'social', isBlocked: true, attemptCountDuringSession: 0 },
  { id: 'discord', name: 'Discord', packageName: 'com.discord', icon: '🎮', category: 'messaging', isBlocked: false, attemptCountDuringSession: 0 },
  { id: 'netflix', name: 'Netflix', packageName: 'com.netflix.mediaclient', icon: '🎬', category: 'video', isBlocked: true, attemptCountDuringSession: 0 },
  { id: 'games', name: 'Mobile Games', packageName: 'com.supercell.clashofclans', icon: '🕹️', category: 'gaming', isBlocked: true, attemptCountDuringSession: 0 },
];

export const storage = {
  getCurrentUser(): User | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  setCurrentUser(user: User | null): void {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  },

  getRegisteredUsers(): User[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USERS_LIST);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveUser(user: User): void {
    const users = this.getRegisteredUsers();
    const existingIndex = users.findIndex(u => u.id === user.id || u.email.toLowerCase() === user.email.toLowerCase());
    if (existingIndex >= 0) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem(STORAGE_KEYS.USERS_LIST, JSON.stringify(users));
  },

  getActiveSession(): FocusSession | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACTIVE_SESSION);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  saveActiveSession(session: FocusSession | null): void {
    if (session) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_SESSION, JSON.stringify(session));
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION);
    }
  },

  getSessionHistory(userId?: string): FocusSession[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SESSION_HISTORY);
      const all: FocusSession[] = data ? JSON.parse(data) : [];
      if (!userId) return all;
      return all.filter(s => s.userId === userId);
    } catch {
      return [];
    }
  },

  addSessionHistory(session: FocusSession): void {
    const history = this.getSessionHistory();
    history.unshift(session);
    // Keep last 100 sessions
    localStorage.setItem(STORAGE_KEYS.SESSION_HISTORY, JSON.stringify(history.slice(0, 100)));
    this.updateStatsFromHistory(history, session.userId);
  },

  getBlockedApps(): AppBlockItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BLOCKED_APPS);
      return data ? JSON.parse(data) : DEFAULT_BLOCKABLE_APPS;
    } catch {
      return DEFAULT_BLOCKABLE_APPS;
    }
  },

  saveBlockedApps(apps: AppBlockItem[]): void {
    localStorage.setItem(STORAGE_KEYS.BLOCKED_APPS, JSON.stringify(apps));
  },

  getPermissions(): AndroidPermissionState {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PERMISSIONS);
      return data ? JSON.parse(data) : {
        usageAccessGranted: true,
        overlayGranted: true,
        accessibilityGranted: true,
        notificationPolicyGranted: false,
      };
    } catch {
      return {
        usageAccessGranted: true,
        overlayGranted: true,
        accessibilityGranted: true,
        notificationPolicyGranted: false,
      };
    }
  },

  savePermissions(perms: AndroidPermissionState): void {
    localStorage.setItem(STORAGE_KEYS.PERMISSIONS, JSON.stringify(perms));
  },

  getStats(userId?: string): FocusStats {
    const history = this.getSessionHistory(userId);
    let totalFocusSeconds = 0;
    let completedCount = 0;
    let distractionsTotal = 0;

    const daysMap: Record<string, number> = {};
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    // Initialize past 7 days
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = dayNames[d.getDay()];
      daysMap[key] = 0;
    }

    history.forEach(s => {
      const duration = s.actualDurationSeconds || 0;
      totalFocusSeconds += duration;
      if (s.status === 'completed' || s.completedGoal === 'full') {
        completedCount++;
      }
      distractionsTotal += s.distractionsPreventedCount || 0;

      if (s.startedAt) {
        const d = new Date(s.startedAt);
        const dayKey = dayNames[d.getDay()];
        if (dayKey in daysMap) {
          daysMap[dayKey] += Math.round(duration / 60);
        }
      }
    });

    const weeklyMinutes = Object.entries(daysMap).map(([day, minutes]) => ({
      day,
      minutes
    }));

    // Calculate streak
    let streak = 0;
    if (history.length > 0) {
      const dates = Array.from(new Set(history.map(s => new Date(s.startedAt).toDateString())));
      streak = Math.min(dates.length, 7); // Active streak
    }

    return {
      totalFocusSeconds,
      sessionsCompleted: completedCount,
      currentStreakDays: streak > 0 ? streak : (completedCount > 0 ? 1 : 0),
      bestStreakDays: Math.max(streak, 4),
      distractionsBlockedTotal: distractionsTotal,
      weeklyMinutes
    };
  },

  updateStatsFromHistory(history: FocusSession[], userId?: string): FocusStats {
    return this.getStats(userId);
  },

  getViewMode(): 'android-frame' | 'fullscreen' {
    return (localStorage.getItem(STORAGE_KEYS.VIEW_MODE) as 'android-frame' | 'fullscreen') || 'android-frame';
  },

  saveViewMode(mode: 'android-frame' | 'fullscreen'): void {
    localStorage.setItem(STORAGE_KEYS.VIEW_MODE, mode);
  },

  getTheme(): 'light' | 'dark' {
    return (localStorage.getItem(STORAGE_KEYS.THEME_MODE) as 'light' | 'dark') || 'light';
  },

  saveTheme(theme: 'light' | 'dark'): void {
    localStorage.setItem(STORAGE_KEYS.THEME_MODE, theme);
  }
};
