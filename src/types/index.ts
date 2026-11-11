export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  provider: 'google' | 'password';
  createdAt: string;
}

export interface YouTubeVideoInfo {
  id: string;
  url: string;
  title: string;
  author: string;
  thumbnailUrl: string;
  durationSeconds: number; // Estimated or parsed duration
  durationFormatted: string;
}

export interface AppBlockItem {
  id: string;
  name: string;
  packageName: string;
  icon: string;
  category: 'social' | 'video' | 'gaming' | 'messaging' | 'other';
  isBlocked: boolean;
  attemptCountDuringSession: number;
}

export interface FocusSession {
  id: string;
  userId: string;
  video: YouTubeVideoInfo;
  targetDurationSeconds: number;
  actualDurationSeconds: number;
  remainingSeconds: number;
  status: 'idle' | 'configuring' | 'running' | 'paused' | 'ended' | 'completed';
  startedAt: string;
  endedAt?: string;
  blockedApps: string[]; // package names or IDs
  distractionsPreventedCount: number;
  completedGoal: 'full' | 'partial' | 'review' | 'not_finished';
  notes: string;
}

export interface FocusStats {
  totalFocusSeconds: number;
  sessionsCompleted: number;
  currentStreakDays: number;
  bestStreakDays: number;
  distractionsBlockedTotal: number;
  weeklyMinutes: { day: string; minutes: number }[];
}

export interface AndroidPermissionState {
  usageAccessGranted: boolean;
  overlayGranted: boolean;
  accessibilityGranted: boolean;
  notificationPolicyGranted: boolean;
}
