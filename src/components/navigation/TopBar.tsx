import React from 'react';
import { useGame } from '../../context/GameContext';
import { NavTab } from '../../types';

interface TopBarProps {
  onOpenAvatarModal?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onOpenAvatarModal }) => {
  const { currentTab, setCurrentTab, userStats } = useGame();

  const getTabTitle = (tab: NavTab) => {
    switch (tab) {
      case 'quests':
        return 'Quests';
      case 'muscles':
        return 'Muscles';
      case 'results':
        return 'Results';
      case 'leaderboard':
        return 'Leaderboard';
      case 'profile':
        return 'Profile';
    }
  };

  return (
    <header className="sticky top-0 w-full z-40 pt-9 pb-2 px-4 bg-surface-container-lowest/85 backdrop-blur-xl border-b border-outline-variant/20 shadow-[0_1px_8px_rgba(0,0,0,0.3)]">
      <div className="h-12 flex items-center justify-between gap-2">
        {/* Logo & Tab Title */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center text-surface-container-lowest shadow-[0_0_12px_rgba(0,255,135,0.4)]">
            <span className="material-symbols-outlined text-[20px] font-bold">bolt</span>
          </div>
          <div className="flex flex-col min-w-0">
            <h1 className="font-headline text-lg font-bold text-on-surface tracking-tight leading-tight truncate">
              {getTabTitle(currentTab)}
            </h1>
            <span className="font-mono text-[10px] uppercase tracking-wider text-primary-fixed-dim truncate">
              {userStats.rankTitle} • Lvl {userStats.level}
            </span>
          </div>
        </div>

        {/* Streak & User Avatar Profile */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Day Streak Pill */}
          <div className="flex items-center gap-1 bg-surface-container-high px-2.5 py-1 rounded-full border border-secondary-container/30 shadow-[0_0_12px_-3px_rgba(238,152,0,0.25)]">
            <span className="text-secondary text-xs">🔥</span>
            <span className="font-mono text-xs font-bold text-secondary tracking-tight">
              {userStats.dayStreak}D
            </span>
          </div>

          {/* Profile Avatar with Status Dot */}
          <button
            onClick={() => {
              setCurrentTab('profile');
              onOpenAvatarModal?.();
            }}
            className={`flex items-center justify-center p-0.5 rounded-full relative active:scale-95 transition-all ${
              currentTab === 'profile' ? 'ring-2 ring-primary-container scale-105' : ''
            }`}
            title="Profile & Activity"
          >
            <img
              src={userStats.avatarUrl}
              alt={userStats.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-primary-container/60 shadow"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-primary-container ring-2 ring-surface-container-lowest"></span>
          </button>
        </div>
      </div>
    </header>
  );
};
