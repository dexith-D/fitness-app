import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { Sun, Moon, Clock, CheckCircle2, Flame } from 'lucide-react';
import { getLevelInfo } from '../../utils/levelCalculator';

interface AvatarCustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AvatarCustomizationModal: React.FC<AvatarCustomizationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { userStats, quests, theme, setTheme, sessionStartTime, totalLoginSeconds } = useGame();

  const [sessionSeconds, setSessionSeconds] = useState<number>(() => {
    return Math.max(0, Math.floor((Date.now() - sessionStartTime) / 1000));
  });

  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setSessionSeconds(Math.max(0, Math.floor((Date.now() - sessionStartTime) / 1000)));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, sessionStartTime]);

  const levelInfo = getLevelInfo(userStats.level);

  if (!isOpen) return null;

  const formatLiveDuration = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    if (hrs > 0) {
      return `${hrs}h ${mins}m ${secs.toString().padStart(2, '0')}s`;
    }
    return `${mins}m ${secs.toString().padStart(2, '0')}s`;
  };

  const formatTotalTime = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    return `${hrs}h ${mins}m`;
  };

  const completedQuestsCount = quests.filter((q) => q.completed).length;
  const totalTasksCompleted = userStats.workoutsCompleted + completedQuestsCount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-sm bg-surface-container-low rounded-3xl p-5 border border-primary-container/40 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
          <div>
            <h2 className="font-headline text-base font-bold text-on-surface">User Profile</h2>
            <span className="font-mono text-[10px] text-on-surface-variant">
              Tier {levelInfo.tierNumber} • Lvl {userStats.level} • {userStats.rankTitle}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface text-xs font-mono px-2 py-0.5 rounded bg-surface-container-high transition-colors"
          >
            ✕
          </button>
        </div>

        {/* User Identity Pedestal */}
        <div className="relative py-3.5 bg-surface-container-lowest rounded-2xl border border-outline-variant/20 flex flex-col items-center justify-center overflow-hidden shadow-inner">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#00ff8715_0%,transparent_70%)] pointer-events-none"></div>

          <div className="relative w-18 h-18 mb-2">
            <img
              src={userStats.avatarUrl}
              alt={userStats.name}
              className="w-16 h-16 rounded-full object-cover ring-4 ring-primary-container shadow-neon-glow"
            />
            <span className="absolute -bottom-1 -right-1 text-sm">👑</span>
          </div>

          <div className="font-headline text-sm font-bold text-on-surface">{userStats.name}</div>
          <div className="font-mono text-[10px] text-primary-fixed-dim uppercase tracking-wider">
            Tier {levelInfo.tierNumber}: {userStats.rankTitle}
          </div>

          <div className="flex items-center gap-2 mt-2 font-mono text-[10px] text-on-surface-variant">
            <span className="flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-secondary" />
              {userStats.dayStreak} Days Streak
            </span>
            <span>•</span>
            <span className="text-primary-container flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse"></span>
              Active Now
            </span>
          </div>
        </div>

        {/* Logged In Time Section */}
        <div className="bg-surface-container-lowest p-3.5 rounded-2xl border border-outline-variant/20 space-y-2">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary-container" />
            <h3 className="font-headline text-xs font-bold text-on-surface">Logged In Time</h3>
          </div>
          <div className="grid grid-cols-2 gap-2 font-mono text-center pt-1">
            <div className="bg-surface-container-high/60 p-2 rounded-xl border border-outline-variant/15">
              <div className="text-[9px] text-on-surface-variant uppercase">Current Session</div>
              <div className="text-xs font-bold text-primary-container mt-0.5">
                {formatLiveDuration(sessionSeconds)}
              </div>
            </div>
            <div className="bg-surface-container-high/60 p-2 rounded-xl border border-outline-variant/15">
              <div className="text-[9px] text-on-surface-variant uppercase">Total Time</div>
              <div className="text-xs font-bold text-on-surface mt-0.5">
                {formatTotalTime(totalLoginSeconds)}
              </div>
            </div>
          </div>
        </div>

        {/* Tasks Completed Section */}
        <div className="bg-surface-container-lowest p-3.5 rounded-2xl border border-outline-variant/20 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-secondary" />
              <h3 className="font-headline text-xs font-bold text-on-surface">Tasks Completed</h3>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-secondary-container/20 text-secondary font-mono text-[10px] font-bold">
              {totalTasksCompleted} Finished
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 font-mono text-xs pt-1">
            <div className="bg-surface-container-high/60 p-2 rounded-xl border border-outline-variant/15">
              <div className="text-[9px] text-on-surface-variant">Workouts</div>
              <div className="font-bold text-on-surface text-xs">{userStats.workoutsCompleted} completed</div>
            </div>
            <div className="bg-surface-container-high/60 p-2 rounded-xl border border-outline-variant/15">
              <div className="text-[9px] text-on-surface-variant">Quests</div>
              <div className="font-bold text-on-surface text-xs">{completedQuestsCount} finished</div>
            </div>
          </div>
        </div>

        {/* Theme Switcher in Profile */}
        <div className="bg-surface-container-lowest p-3.5 rounded-2xl border border-outline-variant/20 space-y-2">
          <div className="flex items-center gap-2">
            {theme === 'dark' ? <Moon className="w-4 h-4 text-secondary" /> : <Sun className="w-4 h-4 text-secondary" />}
            <h3 className="font-headline text-xs font-bold text-on-surface">App Theme</h3>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setTheme('light')}
              className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl font-headline text-xs font-bold transition-all ${
                theme === 'light'
                  ? 'bg-primary-container text-surface-container-lowest shadow-neon-glow border border-primary-container'
                  : 'text-on-surface-variant bg-surface-container-high/40 hover:bg-surface-container-high'
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>Light Mode</span>
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl font-headline text-xs font-bold transition-all ${
                theme === 'dark'
                  ? 'bg-primary-container text-surface-container-lowest shadow-neon-glow border border-primary-container'
                  : 'text-on-surface-variant bg-surface-container-high/40 hover:bg-surface-container-high'
              }`}
            >
              <Moon className="w-3.5 h-3.5 text-secondary" />
              <span>Dark Mode</span>
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full h-10 bg-surface-container-high text-on-surface font-headline font-bold text-xs rounded-xl flex items-center justify-center gap-1 border border-outline-variant/30 hover:bg-surface-container-highest transition-all mt-1"
        >
          <span>Close</span>
        </button>
      </div>
    </div>
  );
};
