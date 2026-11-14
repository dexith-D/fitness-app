import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { formatXP } from '../../utils/levelCalculator';

interface QuestsDashboardProps {
  onOpenCreateQuest: () => void;
}

export const QuestsDashboard: React.FC<QuestsDashboardProps> = ({ onOpenCreateQuest }) => {
  const { userStats, quests, startWorkout } = useGame();
  const [cheered, setCheered] = useState(false);

  const xpPercent = Math.min(
    100,
    Math.round((userStats.currentXP / userStats.xpToNextLevel) * 100)
  );
  const xpNeeded = Math.max(0, userStats.xpToNextLevel - userStats.currentXP);

  const recommendedQuest =
    quests.find((q) => q.category === 'recommended' && !q.completed) ||
    quests.find((q) => !q.completed) ||
    quests[0];

  const weeklyQuest = quests.find((q) => q.category === 'weekly');

  return (
    <div className="flex-1 w-full overflow-y-auto pb-24 px-4 pt-3 space-y-4">
      {/* 1. Top Player HUD Status Card */}
      <div className="bg-surface-container-low rounded-2xl p-4 shadow-md border border-outline-variant/30 relative overflow-hidden">
        {/* Header Row */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-primary-container/20 text-primary-container font-mono text-base font-bold border border-primary-container/40">
              {userStats.level}
            </span>
            <div>
              <span className="font-headline text-base text-on-surface font-bold block leading-tight">
                {userStats.name}
              </span>
              <span className="font-mono text-[11px] text-on-surface-variant">
                {userStats.rankTitle}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-surface-container-high px-3 py-1 rounded-full border border-secondary/20 shadow-inner">
            <span className="text-secondary text-sm">🔥</span>
            <span className="font-mono text-xs text-secondary font-bold">
              {userStats.dayStreak} Day Streak
            </span>
          </div>
        </div>

        {/* Level XP Progress Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between items-baseline font-mono text-xs">
            <span className="text-on-surface-variant uppercase tracking-wider font-semibold text-[10px]">
              Level XP
            </span>
            <div className="flex items-center gap-1">
              <span className="text-primary-fixed-dim font-bold">
                {formatXP(userStats.currentXP)}
              </span>
              <span className="text-outline">/ {formatXP(userStats.xpToNextLevel)} XP</span>
              <span className="text-primary-container font-semibold ml-1">({xpPercent}%)</span>
            </div>
          </div>

          <div className="w-full h-3 bg-surface-container-highest rounded-full overflow-hidden p-0.5 border border-outline-variant/30">
            <div
              className="h-full bg-primary-container rounded-full shadow-[0_0_12px_rgba(0,255,135,0.7)] transition-all duration-500"
              style={{ width: `${xpPercent}%` }}
            ></div>
          </div>

          <div className="flex justify-between items-center font-mono text-[11px] text-outline pt-0.5">
            <span>Next Goal: Level {userStats.level + 1}</span>
            <span className="text-primary-container font-medium">{formatXP(xpNeeded)} XP needed</span>
          </div>
        </div>
      </div>

      {/* 2. Primary Instant Action Deck */}
      {recommendedQuest && !recommendedQuest.completed && (
        <button
          onClick={() => startWorkout(recommendedQuest.id)}
          className="w-full bg-primary-container text-surface-container-lowest py-3.5 px-4 rounded-2xl flex items-center justify-between active:scale-[0.98] transition-all shadow-neon-glow group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-surface-container-lowest/15 flex items-center justify-center text-surface-container-lowest">
              <span className="material-symbols-outlined text-[24px]">play_arrow</span>
            </div>
            <div className="text-left">
              <span className="font-headline text-base leading-none block font-bold text-surface-container-lowest">
                Start Today's Workout
              </span>
              <span className="font-mono text-xs opacity-90 text-surface-container-lowest mt-0.5 block">
                Earn +{recommendedQuest.xpReward} XP upon completion
              </span>
            </div>
          </div>
          <span className="material-symbols-outlined text-surface-container-lowest text-[22px] group-hover:translate-x-1 transition-transform">
            arrow_forward
          </span>
        </button>
      )}

      {/* 3. Player Attributes Telemetry Matrix */}
      <div className="bg-surface-container-low rounded-2xl p-3.5 space-y-2 border border-outline-variant/30 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-primary-container">
              insights
            </span>
            <span className="font-mono text-xs uppercase tracking-wider text-on-surface font-bold">
              Your Stats
            </span>
          </div>
          <span className="font-mono text-[10px] text-outline">Updated today</span>
        </div>

        <div className="grid grid-cols-3 gap-2 font-mono">
          <div className="bg-surface-container-high rounded-xl p-2.5 flex flex-col items-center justify-center text-center border border-outline-variant/20">
            <span className="text-[10px] text-on-surface-variant uppercase mb-0.5">Workouts</span>
            <span className="font-headline text-lg font-bold text-primary-container">
              {userStats.workoutsCompleted}
            </span>
          </div>
          <div className="bg-surface-container-high rounded-xl p-2.5 flex flex-col items-center justify-center text-center border border-outline-variant/20">
            <span className="text-[10px] text-on-surface-variant uppercase mb-0.5">Day Streak</span>
            <span className="font-headline text-lg font-bold text-secondary">
              {userStats.dayStreak}D
            </span>
          </div>
          <div className="bg-surface-container-high rounded-xl p-2.5 flex flex-col items-center justify-center text-center border border-outline-variant/20">
            <span className="text-[10px] text-on-surface-variant uppercase mb-0.5">Total XP</span>
            <span className="font-headline text-lg font-bold text-tertiary-fixed-dim">
              {formatXP(userStats.totalXP)}
            </span>
          </div>
        </div>
      </div>

      {/* 4. Active Daily Quests Block */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px] text-primary-container">
              checklist
            </span>
            <h2 className="font-headline text-base text-on-surface tracking-tight font-bold">
              Daily Quests
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-outline bg-surface-container-highest px-2 py-0.5 rounded">
              Resets in 6h
            </span>
            <button
              onClick={onOpenCreateQuest}
              className="flex items-center gap-1 font-mono text-[11px] text-primary-container bg-primary-container/15 hover:bg-primary-container/25 px-2 py-0.5 rounded-lg border border-primary-container/30 transition-colors"
            >
              <Plus className="w-3 h-3" />
              <span>New</span>
            </button>
          </div>
        </div>

        {/* Quest Cards */}
        {quests
          .filter((q) => q.category !== 'weekly')
          .map((quest) => {
            const isCompleted = quest.completed;
            const isStepQuest = quest.category === 'steps';

            return (
              <div
                key={quest.id}
                className={`bg-surface-container-low rounded-2xl p-4 space-y-2.5 border transition-all relative overflow-hidden shadow-sm ${
                  isCompleted
                    ? 'border-primary-container/30 opacity-75'
                    : 'border-outline-variant/30 hover:border-outline-variant/50'
                }`}
              >
                {/* Accent border strip */}
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1 ${
                    quest.category === 'recommended'
                      ? 'bg-primary-container'
                      : quest.category === 'routine'
                      ? 'bg-tertiary-fixed-dim'
                      : 'bg-secondary'
                  }`}
                ></div>

                <div className="flex items-start justify-between gap-2 pl-1">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span
                        className={`font-mono text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                          quest.category === 'recommended'
                            ? 'bg-primary-container/15 text-primary-container'
                            : quest.category === 'routine'
                            ? 'bg-tertiary-container/30 text-tertiary-fixed-dim'
                            : 'bg-secondary-container/20 text-secondary'
                        }`}
                      >
                        {quest.category === 'recommended'
                          ? 'Recommended'
                          : quest.category === 'routine'
                          ? 'Quick Routine'
                          : quest.category === 'steps'
                          ? 'Daily Goal'
                          : 'Custom Quest'}
                      </span>
                      {isCompleted && (
                        <span className="font-mono text-[9px] uppercase font-bold text-primary-container flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-[12px]">check</span>
                          Done
                        </span>
                      )}
                    </div>
                    <h3 className="font-headline text-sm font-semibold text-on-surface truncate">
                      {quest.title}
                    </h3>
                    <p className="font-body text-xs text-on-surface-variant mt-0.5">
                      {quest.subtitle}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`font-mono text-sm block font-bold ${
                        quest.category === 'recommended'
                          ? 'text-primary-container'
                          : quest.category === 'routine'
                          ? 'text-tertiary-fixed-dim'
                          : 'text-secondary'
                      }`}
                    >
                      +{quest.xpReward} XP
                    </span>
                  </div>
                </div>

                {/* Bottom Row / Actions */}
                <div className="pl-1 pt-1 flex items-center justify-between font-mono text-xs">
                  {isStepQuest ? (
                    <div className="w-full space-y-1">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-outline">Progress</span>
                        <span className="text-on-surface font-bold">
                          {formatXP(quest.progress)} / {formatXP(quest.goal)} steps
                        </span>
                      </div>
                      <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-secondary h-full rounded-full"
                          style={{
                            width: `${Math.min(100, (quest.progress / quest.goal) * 100)}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <span className="text-outline text-[11px]">
                        Est. {quest.durationMins} mins
                      </span>
                      {isCompleted ? (
                        <span className="px-3 py-1 bg-surface-container-high text-primary-container rounded-lg text-xs font-semibold flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">
                            check_circle
                          </span>
                          Completed
                        </span>
                      ) : (
                        <button
                          onClick={() => startWorkout(quest.id)}
                          className={`px-3.5 py-1.5 rounded-xl font-headline text-xs font-bold flex items-center gap-1 active:scale-95 transition-all ${
                            quest.category === 'recommended'
                              ? 'bg-primary-container text-surface-container-lowest shadow-neon-glow'
                              : 'bg-surface-container-high hover:bg-surface-bright text-on-surface'
                          }`}
                        >
                          Start
                          <span className="material-symbols-outlined text-[14px]">play_arrow</span>
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
      </div>

      {/* 5. Weekly Epic Bounty Challenge */}
      {weeklyQuest && (
        <div className="bg-surface-container-low rounded-2xl p-4 shadow-md border border-secondary/30 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-secondary">
                emoji_events
              </span>
              <span className="font-mono text-xs uppercase font-bold tracking-wider text-secondary">
                Weekly Challenge
              </span>
            </div>
            <span className="font-mono text-[10px] text-secondary bg-surface-container-high px-2 py-0.5 rounded-full font-bold">
              4 Days Left
            </span>
          </div>

          <div className="mb-2.5">
            <h3 className="font-headline text-sm text-on-surface font-bold">
              {weeklyQuest.title}
            </h3>
            <p className="font-body text-xs text-on-surface-variant mt-0.5">
              {weeklyQuest.subtitle}
            </p>
          </div>

          <div className="bg-surface-container-high rounded-xl p-2.5 space-y-1.5 mb-2 font-mono text-xs">
            <div className="flex justify-between items-baseline text-[11px]">
              <span className="text-on-surface-variant">Workouts Done</span>
              <span className="text-on-surface font-bold">
                {weeklyQuest.progress} of {weeklyQuest.goal} completed
              </span>
            </div>
            <div className="w-full bg-surface-container-lowest h-2 rounded-full overflow-hidden">
              <div
                className="bg-secondary h-full rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(100, (weeklyQuest.progress / weeklyQuest.goal) * 100)}%`,
                }}
              ></div>
            </div>
          </div>

          <div className="flex items-center justify-between bg-surface-container-lowest px-3 py-2 rounded-xl border border-outline-variant/20 font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="text-xs">🎁</span>
              <span className="text-on-surface font-medium text-[11px]">
                Reward: +1,000 XP • Consistency Badge
              </span>
            </div>
            <span className="text-secondary font-bold text-[11px]">
              {Math.round((weeklyQuest.progress / weeklyQuest.goal) * 100)}%
            </span>
          </div>
        </div>
      )}

      {/* 6. Gym Buddy Live Activity Radar */}
      <div className="bg-surface-container-low rounded-2xl p-3.5 flex items-center justify-between shadow-sm border border-outline-variant/20">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative w-9 h-9 shrink-0">
            <img
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80"
              alt="Valkyrie"
              className="w-full h-full rounded-full object-cover ring-2 ring-primary-container"
            />
            <span className="absolute bottom-0 right-0 w-2 h-2 bg-primary-container rounded-full ring-1 ring-surface-container-low"></span>
          </div>
          <div className="truncate">
            <span className="font-headline text-xs text-on-surface font-semibold block leading-tight truncate">
              Valkyrie just finished a workout!
            </span>
            <span className="font-mono text-[10px] text-on-surface-variant truncate block">
              {cheered ? 'Cheer sent! +5 Karma' : 'Cheer them on'}
            </span>
          </div>
        </div>

        <button
          onClick={() => setCheered(true)}
          className={`px-3 py-1.5 rounded-xl font-mono text-[11px] font-semibold flex items-center gap-1 active:scale-95 transition-all ${
            cheered
              ? 'bg-primary-container/20 text-primary-container border border-primary-container/40'
              : 'bg-surface-container-high hover:bg-surface-bright text-primary-container'
          }`}
        >
          <span className="material-symbols-outlined text-[14px]">
            {cheered ? 'favorite' : 'thumb_up'}
          </span>
          <span>{cheered ? 'Cheered' : 'Cheer'}</span>
        </button>
      </div>
    </div>
  );
};
