/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AndroidFrame } from './components/AndroidFrame';
import { Header } from './components/Header';
import { AuthScreen } from './components/AuthScreen';
import { VideoSelector } from './components/VideoSelector';
import { TimerConfig } from './components/TimerConfig';
import { AppBlockerConfig } from './components/AppBlockerConfig';
import { FocusPlayer } from './components/FocusPlayer';
import { SessionCompletionModal } from './components/SessionCompletionModal';
import { DistractionAlert } from './components/DistractionAlert';
import { PermissionsGuideModal } from './components/PermissionsGuideModal';
import { StatsView } from './components/StatsView';
import { YouTubeVideoInfo, FocusSession } from './types';
import { storage } from './utils/storage';
import { soundManager } from './utils/audio';

function MainAppContent() {
  const { user, isLoading } = useAuth();
  const [currentTab, setCurrentTab] = useState<'focus' | 'blocker' | 'stats'>('focus');
  const [isDark, setIsDark] = useState<boolean>(() => storage.getTheme() === 'dark');

  // Multi-step session creation state
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideoInfo | null>(null);
  const [targetDurationSeconds, setTargetDurationSeconds] = useState<number>(1800); // 30m default
  const [setupStep, setSetupStep] = useState<'video' | 'timer' | 'blocker'>('video');

  // Active Focus Session
  const [activeSession, setActiveSession] = useState<FocusSession | null>(() => storage.getActiveSession());
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [completedSessionData, setCompletedSessionData] = useState<FocusSession | null>(null);

  // Distraction Blocker Simulator
  const [simulatedBlockedApp, setSimulatedBlockedApp] = useState<string | null>(null);

  // Permissions transparency guide
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);

  // Sync theme with DOM
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      storage.saveTheme('dark');
    } else {
      document.documentElement.classList.remove('dark');
      storage.saveTheme('light');
    }
  }, [isDark]);

  const handleToggleTheme = () => {
    setIsDark(prev => !prev);
  };

  // Step 1: Video Selected
  const handleVideoSelected = (video: YouTubeVideoInfo) => {
    setSelectedVideo(video);
    // If video has known duration, prefill timer to video duration
    if (video.durationSeconds > 0) {
      setTargetDurationSeconds(video.durationSeconds);
    }
    setSetupStep('timer');
  };

  // Step 2: Duration Chosen
  const handleDurationSelected = (seconds: number) => {
    setTargetDurationSeconds(seconds);
    setSetupStep('blocker');
  };

  // Step 3: Launch Focus Session
  const handleLaunchSession = (blockedAppIds: string[]) => {
    if (!selectedVideo || !user) return;

    soundManager.playStartChime();

    const newSession: FocusSession = {
      id: 'sess_' + Date.now().toString(36),
      userId: user.id,
      video: selectedVideo,
      targetDurationSeconds,
      actualDurationSeconds: 0,
      remainingSeconds: targetDurationSeconds,
      status: 'running',
      startedAt: new Date().toISOString(),
      blockedApps: blockedAppIds,
      distractionsPreventedCount: 0,
      completedGoal: 'full',
      notes: ''
    };

    setActiveSession(newSession);
    storage.saveActiveSession(newSession);
  };

  // Session Updates (Timer tick, note changes, pause/resume)
  const handleUpdateSession = (updated: FocusSession) => {
    setActiveSession(updated);
    storage.saveActiveSession(updated);
  };

  // Timer Finished
  const handleCompleteSession = (defaultGoal: 'full' | 'partial' | 'review') => {
    if (!activeSession) return;
    const finalSession: FocusSession = {
      ...activeSession,
      status: 'completed',
      endedAt: new Date().toISOString(),
      completedGoal: defaultGoal
    };

    setCompletedSessionData(finalSession);
    setShowCompletionModal(true);
    setActiveSession(null);
    storage.saveActiveSession(null);
  };

  // End Session Early
  const handleEndEarly = () => {
    if (!activeSession) return;
    soundManager.playTick();
    const finalSession: FocusSession = {
      ...activeSession,
      status: 'ended',
      endedAt: new Date().toISOString(),
      completedGoal: 'partial'
    };

    setCompletedSessionData(finalSession);
    setShowCompletionModal(true);
    setActiveSession(null);
    storage.saveActiveSession(null);
  };

  // Final confirmation from completion modal
  const handleConfirmCompletion = (completedGoal: 'full' | 'partial' | 'review') => {
    if (!completedSessionData) return;
    const saved: FocusSession = {
      ...completedSessionData,
      completedGoal
    };

    storage.addSessionHistory(saved);
    setShowCompletionModal(false);
    setCompletedSessionData(null);
    setSelectedVideo(null);
    setSetupStep('video');
    setCurrentTab('stats'); // Navigate to stats to celebrate progress!
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-center text-xs text-[#64748B]">
        <div className="w-8 h-8 rounded-full border-2 border-[#87CEEB] border-t-transparent animate-spin mb-2" />
      </div>
    );
  }

  // Not signed in -> Display Welcome & Login/Register Screen
  if (!user) {
    return (
      <AndroidFrame isDark={isDark} onToggleTheme={handleToggleTheme}>
        <AuthScreen />
      </AndroidFrame>
    );
  }

  return (
    <AndroidFrame isDark={isDark} onToggleTheme={handleToggleTheme}>
      {/* Top Header Navigation */}
      <Header
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          if (tab === 'focus') {
            setSetupStep('video');
          }
        }}
        isSessionActive={!!activeSession}
        onOpenPermissionsGuide={() => setShowPermissionsModal(true)}
      />

      {/* Main Body */}
      <div className="flex-1 p-3 sm:p-4 overflow-y-auto">
        {/* If Active Session is running -> Render Focus Player */}
        {activeSession ? (
          <FocusPlayer
            session={activeSession}
            onUpdateSession={handleUpdateSession}
            onCompleteSession={handleCompleteSession}
            onEndEarly={handleEndEarly}
            onOpenAppBlockerSim={(appName) => setSimulatedBlockedApp(appName)}
          />
        ) : (
          /* Normal Tab Content */
          <>
            {currentTab === 'focus' && (
              <div className="space-y-4 max-w-lg mx-auto">
                {setupStep === 'video' && (
                  <VideoSelector
                    selectedVideo={selectedVideo}
                    onVideoSelected={handleVideoSelected}
                  />
                )}

                {setupStep === 'timer' && selectedVideo && (
                  <div className="space-y-3">
                    <button
                      onClick={() => setSetupStep('video')}
                      className="text-xs font-bold text-[#3A89A8] dark:text-[#87CEEB] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      ← Back to Video Selection
                    </button>
                    <TimerConfig
                      video={selectedVideo}
                      initialSeconds={targetDurationSeconds}
                      onDurationSelected={handleDurationSelected}
                    />
                  </div>
                )}

                {setupStep === 'blocker' && selectedVideo && (
                  <div className="space-y-3">
                    <button
                      onClick={() => setSetupStep('timer')}
                      className="text-xs font-bold text-[#3A89A8] dark:text-[#87CEEB] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      ← Back to Timer Setup
                    </button>
                    <AppBlockerConfig
                      onConfirmApps={handleLaunchSession}
                      onOpenPermissionsModal={() => setShowPermissionsModal(true)}
                    />
                  </div>
                )}
              </div>
            )}

            {currentTab === 'blocker' && (
              <div className="max-w-lg mx-auto">
                <AppBlockerConfig
                  isStandaloneTab={true}
                  onConfirmApps={() => setCurrentTab('focus')}
                  onOpenPermissionsModal={() => setShowPermissionsModal(true)}
                />
              </div>
            )}

            {currentTab === 'stats' && (
              <div className="max-w-lg mx-auto">
                <StatsView
                  onStartNewSession={() => {
                    setCurrentTab('focus');
                    setSetupStep('video');
                    setSelectedVideo(null);
                  }}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Completion Modal */}
      {showCompletionModal && completedSessionData && (
        <SessionCompletionModal
          session={completedSessionData}
          onConfirmCompletion={handleConfirmCompletion}
        />
      )}

      {/* Distraction Interception Modal (App Blocker Simulation) */}
      {simulatedBlockedApp && activeSession && (
        <DistractionAlert
          appName={simulatedBlockedApp}
          videoTitle={activeSession.video.title}
          remainingSeconds={activeSession.remainingSeconds}
          onReturnToMindora={() => setSimulatedBlockedApp(null)}
        />
      )}

      {/* Android Permissions Transparency Modal */}
      {showPermissionsModal && (
        <PermissionsGuideModal onClose={() => setShowPermissionsModal(false)} />
      )}
    </AndroidFrame>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
