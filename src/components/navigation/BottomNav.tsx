import React from 'react';
import { useGame } from '../../context/GameContext';
import { NavTab } from '../../types';

export const BottomNav: React.FC = () => {
  const { currentTab, setCurrentTab } = useGame();

  const tabs: { id: NavTab; label: string; icon: string }[] = [
    { id: 'quests', label: 'Quests', icon: 'swords' },
    { id: 'muscles', label: 'Muscles', icon: 'accessibility_new' },
    { id: 'results', label: 'Results', icon: 'emoji_events' },
    { id: 'leaderboard', label: 'Ranks', icon: 'military_tech' },
    { id: 'profile', label: 'Profile', icon: 'person' },
  ];

  return (
    <nav className="sticky bottom-0 w-full z-40 bg-surface-container-lowest/90 backdrop-blur-xl border-t border-outline-variant/20 shadow-[0_-1px_12px_rgba(0,0,0,0.4)] pb-4 pt-1">
      <div className="flex items-center justify-around h-14 px-2">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1 transition-all duration-150 active:scale-95 ${
                isActive
                  ? 'text-primary-container font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <div className="relative">
                <span
                  className={`material-symbols-outlined text-[22px] transition-transform ${
                    isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(0,255,135,0.6)]' : ''
                  }`}
                >
                  {tab.icon}
                </span>
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary-container"></span>
                )}
              </div>
              <span className="font-mono text-[10px] mt-0.5 tracking-wider uppercase">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
