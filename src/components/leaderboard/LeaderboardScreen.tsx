import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { formatXP } from '../../utils/levelCalculator';

export const LeaderboardScreen: React.FC = () => {
  const { leaderboard, setCurrentTab } = useGame();
  const [activeTab, setActiveTab] = useState<'division' | 'friends'>('division');

  // Find user entry and top 3
  const userEntry = leaderboard.find((entry) => entry.isUser) || leaderboard[3];
  const top1 = leaderboard[0];
  const top2 = leaderboard[1];
  const top3 = leaderboard[2];

  // Rivalry competitor (ShadowFit or adjacent rank)
  const rivalEntry = leaderboard.find((e) => e.name.includes('ShadowFit')) || leaderboard[4];

  return (
    <div className="flex-1 w-full overflow-y-auto pb-24 px-4 pt-3 space-y-4">
      {/* 1. Segmented Division Filter */}
      <div className="w-full bg-surface-container-lowest p-1 rounded-xl flex items-center justify-between border border-outline-variant/30 shadow-sm">
        <button
          onClick={() => setActiveTab('friends')}
          className={`flex-1 py-1.5 rounded-lg font-mono text-xs uppercase transition-all ${
            activeTab === 'friends'
              ? 'bg-surface-container-high text-primary-container shadow font-bold border border-primary-container/20'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Friends
        </button>
        <button
          onClick={() => setActiveTab('division')}
          className={`flex-1 py-1.5 rounded-lg font-mono text-xs uppercase transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'division'
              ? 'bg-surface-container-high text-primary-container shadow font-bold border border-primary-container/20'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse"></span>
          Division (Diamond IV)
        </button>
      </div>

      {/* 2. Season / League Status Banner */}
      <div className="w-full bg-gradient-to-r from-surface-container-low via-surface-container to-surface-container-low p-3.5 rounded-2xl flex items-center justify-between border border-outline-variant/30 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-secondary border border-secondary/20 shadow-inner shrink-0">
            <span className="material-symbols-outlined text-[24px]">military_tech</span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline text-sm font-bold text-on-surface">
              Diamond League IV
            </span>
            <span className="font-body text-[11px] text-on-surface-variant">
              Top 3 players advance to Champion Tier
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container-high text-secondary font-mono text-[10px] font-semibold border border-secondary/20 shrink-0">
          <span className="material-symbols-outlined text-[14px]">schedule</span>
          <span>4d left</span>
        </div>
      </div>

      {/* 3. Player Current Standings Sticky Hero Card */}
      {userEntry && (
        <div className="w-full bg-surface-container-high p-3.5 rounded-2xl border border-primary-container/40 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative shrink-0">
                <img
                  src={userEntry.avatarUrl}
                  alt={userEntry.name}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-primary-container"
                />
                <span className="absolute -bottom-1 -right-1 font-mono text-[10px] bg-primary-container text-surface-container-lowest font-bold px-1.5 py-0.2 rounded-full shadow-sm">
                  #{userEntry.rank}
                </span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-headline text-sm text-on-surface font-bold truncate">
                  {userEntry.name}
                </span>
                <div className="flex items-center gap-1 text-secondary font-mono text-[10px] mt-0.5 truncate">
                  <span className="material-symbols-outlined text-[13px]">trending_up</span>
                  <span>
                    {userEntry.rank <= 3
                      ? 'Inside Top 3 promotion zone!'
                      : 'Needs 480 XP to reach Top 3'}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right shrink-0 bg-surface-container-lowest/80 px-3 py-1.5 rounded-xl border border-outline-variant/30 font-mono">
              <span className="text-sm text-primary-container font-bold leading-none block">
                {formatXP(userEntry.xp)}
              </span>
              <span className="text-[9px] text-outline uppercase tracking-wider block mt-0.5">
                Total XP
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 4. Top 3 Podium Visual Showcase */}
      <div className="w-full pt-2">
        <div className="flex items-end justify-center gap-2 px-1">
          {/* #2 Kratos */}
          {top2 && (
            <div className="flex-1 flex flex-col items-center">
              <div className="relative mb-2 flex flex-col items-center">
                <span className="font-mono text-[10px] text-on-surface bg-surface-container-high px-2 py-0.5 rounded-full mb-1 font-bold border border-outline-variant/30">
                  #2
                </span>
                <div className="w-13 h-13 rounded-full bg-surface-container-high p-0.5 shadow-md">
                  <img
                    src={top2.avatarUrl}
                    alt={top2.name}
                    className="w-12 h-12 rounded-full object-cover ring-1 ring-outline"
                  />
                </div>
              </div>
              <div className="w-full bg-surface-container-low rounded-t-2xl p-2.5 text-center flex flex-col items-center min-h-[90px] justify-between border-t border-l border-r border-outline-variant/30 shadow-sm">
                <span className="font-headline text-xs font-semibold text-on-surface truncate w-full">
                  {top2.name}
                </span>
                <div className="w-full py-1 bg-surface-container-lowest/70 rounded-lg font-mono">
                  <span className="text-xs text-tertiary-fixed-dim font-bold block">
                    {formatXP(top2.xp)}
                  </span>
                  <span className="text-[8px] text-outline uppercase block">XP</span>
                </div>
              </div>
            </div>
          )}

          {/* #1 Valkyrie (Center Tallest) */}
          {top1 && (
            <div className="flex-1 flex flex-col items-center z-10 -mx-1">
              <div className="relative mb-2 flex flex-col items-center">
                <span className="text-secondary text-sm animate-bounce">👑</span>
                <span className="font-mono text-[10px] text-secondary bg-secondary-container/20 px-2 py-0.5 rounded-full mb-1 font-bold border border-secondary/30">
                  #1
                </span>
                <div className="w-16 h-16 rounded-full bg-secondary/30 p-1 shadow-amber-glow">
                  <img
                    src={top1.avatarUrl}
                    alt={top1.name}
                    className="w-full h-full rounded-full object-cover ring-2 ring-secondary"
                  />
                </div>
              </div>
              <div className="w-full bg-surface-container-low rounded-t-2xl p-3 text-center flex flex-col items-center min-h-[110px] justify-between border-t-2 border-l border-r border-secondary/40 shadow-md">
                <span className="font-headline text-xs font-bold text-on-surface truncate w-full">
                  {top1.name}
                </span>
                <div className="w-full py-1 bg-secondary-container/15 rounded-lg border border-secondary/20 font-mono">
                  <span className="text-xs text-secondary font-bold block">
                    {formatXP(top1.xp)}
                  </span>
                  <span className="text-[8px] text-secondary uppercase block">XP</span>
                </div>
              </div>
            </div>
          )}

          {/* #3 NeonBeast */}
          {top3 && (
            <div className="flex-1 flex flex-col items-center">
              <div className="relative mb-2 flex flex-col items-center">
                <span className="font-mono text-[10px] text-on-surface bg-surface-container-high px-2 py-0.5 rounded-full mb-1 font-bold border border-outline-variant/30">
                  #3
                </span>
                <div className="w-13 h-13 rounded-full bg-surface-container-high p-0.5 shadow-md">
                  <img
                    src={top3.avatarUrl}
                    alt={top3.name}
                    className="w-12 h-12 rounded-full object-cover ring-1 ring-outline"
                  />
                </div>
              </div>
              <div className="w-full bg-surface-container-low rounded-t-2xl p-2.5 text-center flex flex-col items-center min-h-[80px] justify-between border-t border-l border-r border-outline-variant/30 shadow-sm">
                <span className="font-headline text-xs font-semibold text-on-surface truncate w-full">
                  {top3.name}
                </span>
                <div className="w-full py-1 bg-surface-container-lowest/70 rounded-lg font-mono">
                  <span className="text-xs text-tertiary-fixed-dim font-bold block">
                    {formatXP(top3.xp)}
                  </span>
                  <span className="text-[8px] text-outline uppercase block">XP</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 5. Full Division Ranks Ladder */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="font-headline text-sm font-bold text-on-surface">Leaderboard</span>
          <span className="font-mono text-xs text-outline">Ranks 4 - 7</span>
        </div>

        {leaderboard.slice(3).map((entry) => {
          const isCurrentUser = entry.isUser;
          return (
            <div
              key={entry.rank}
              className={`p-3 rounded-2xl flex items-center justify-between border transition-all ${
                isCurrentUser
                  ? 'bg-surface-container-high border-primary-container/60 shadow-md ring-1 ring-primary-container/20'
                  : 'bg-surface-container-low border-outline-variant/20 hover:bg-surface-container'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={`font-mono text-xs font-bold w-6 text-center ${
                    isCurrentUser ? 'text-primary-container' : 'text-outline'
                  }`}
                >
                  #{entry.rank}
                </span>
                <img
                  src={entry.avatarUrl}
                  alt={entry.name}
                  className={`w-9 h-9 rounded-full object-cover ring-1 ${
                    isCurrentUser ? 'ring-primary-container' : 'ring-outline-variant'
                  }`}
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-headline text-xs font-bold text-on-surface truncate">
                      {entry.name}
                    </span>
                    {isCurrentUser && (
                      <span className="font-mono text-[8px] bg-primary-container text-surface-container-lowest px-1.5 py-0.2 rounded font-bold uppercase">
                        YOU
                      </span>
                    )}
                  </div>
                  {entry.diffFromUser && (
                    <span className="font-mono text-[9px] text-on-surface-variant block truncate">
                      {entry.diffFromUser}
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right shrink-0 font-mono">
                <span
                  className={`text-xs font-bold block ${
                    isCurrentUser ? 'text-primary-container' : 'text-on-surface'
                  }`}
                >
                  {formatXP(entry.xp)}
                </span>
                <span className="text-[9px] text-outline uppercase block">XP</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 6. Weekly Matchup 1v1 Rivalry Card */}
      {rivalEntry && (
        <div className="bg-surface-container-low rounded-2xl p-4 border border-secondary/30 space-y-3 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-secondary-container/20 text-secondary text-xs">
                🤝
              </span>
              <div>
                <span className="font-mono text-[10px] uppercase font-bold text-secondary block">
                  Weekly Rival Matchup
                </span>
                <h3 className="font-headline text-xs font-bold text-on-surface">
                  You vs {rivalEntry.name}
                </h3>
              </div>
            </div>
            <span className="font-mono text-[10px] text-primary-container bg-surface-container-high px-2 py-0.5 rounded font-bold border border-primary-container/20">
              +250 XP BONUS
            </span>
          </div>

          <p className="font-body text-xs text-on-surface-variant">
            Friendly rivalry! Finish ahead of {rivalEntry.name} when the timer resets to claim a
            bonus XP cache.
          </p>

          <div className="bg-surface-container-high rounded-xl p-3 space-y-2 font-mono text-xs">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-primary-container font-bold">
                You: {formatXP(userEntry.xp)} XP
              </span>
              <span className="text-secondary font-bold">
                {rivalEntry.name}: {formatXP(rivalEntry.xp)} XP
              </span>
            </div>

            {/* Duel Progress Bar */}
            <div className="w-full bg-surface-container-lowest h-2.5 rounded-full overflow-hidden flex">
              <div
                className="bg-primary-container h-full transition-all duration-300"
                style={{
                  width: `${Math.round(
                    (userEntry.xp / (userEntry.xp + rivalEntry.xp)) * 100
                  )}%`,
                }}
              ></div>
              <div
                className="bg-secondary h-full transition-all duration-300"
                style={{
                  width: `${Math.round(
                    (rivalEntry.xp / (userEntry.xp + rivalEntry.xp)) * 100
                  )}%`,
                }}
              ></div>
            </div>

            <div className="flex justify-between text-[10px] text-outline">
              <span>+{formatXP(Math.max(0, userEntry.xp - rivalEntry.xp))} XP ahead</span>
              <span>Ends in 4 days</span>
            </div>
          </div>

          <button
            onClick={() => setCurrentTab('quests')}
            className="w-full h-11 bg-primary-container text-surface-container-lowest font-headline font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-neon-glow active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">fitness_center</span>
            <span>Log Workout & Push Ahead</span>
          </button>
        </div>
      )}
    </div>
  );
};
