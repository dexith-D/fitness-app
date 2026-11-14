import React from 'react';
import { useGame } from '../../context/GameContext';
import { formatXP } from '../../utils/levelCalculator';

export const WorkoutResultsScreen: React.FC = () => {
  const { lastWorkoutResult, userStats, setCurrentTab, allocateStatPoint } = useGame();

  // If no workout has been performed yet, show an informative banner
  if (!lastWorkoutResult) {
    return (
      <div className="flex-1 w-full overflow-y-auto pb-24 px-4 pt-10 flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-surface-container-high flex items-center justify-center text-outline">
          <span className="material-symbols-outlined text-[36px]">fitness_center</span>
        </div>
        <div className="space-y-1">
          <h2 className="font-headline text-lg font-bold text-on-surface">No Completed Workouts Yet</h2>
          <p className="font-body text-xs text-on-surface-variant max-w-xs">
            Start and finish a workout from the Quests tab to unlock your victory telemetry, XP
            breakdown, and stat gains!
          </p>
        </div>
        <button
          onClick={() => setCurrentTab('quests')}
          className="bg-primary-container text-surface-container-lowest font-headline font-bold text-xs px-5 py-2.5 rounded-xl shadow-neon-glow active:scale-95 transition-all"
        >
          Go to Quests
        </button>
      </div>
    );
  }

  const {
    questTitle,
    baseXP,
    streakBonusXP,
    formBonusXP,
    totalXP,
    oldLevel,
    newLevel,
    newRank,
    strengthGain,
    staminaGain,
    durationMins,
    calories,
    volumeKg,
    avgHeartRate,
    badgeUnlocked,
  } = lastWorkoutResult;

  const xpPercent = Math.min(
    100,
    Math.round((userStats.currentXP / userStats.xpToNextLevel) * 100)
  );

  return (
    <div className="flex-1 w-full overflow-y-auto pb-24 px-4 pt-3 space-y-4">
      {/* 1. Victory Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-surface-container-low p-4 border border-outline-variant/30 shadow-xl text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high border border-secondary/30 shadow-amber-glow">
          <span className="text-secondary text-xs">🎉</span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-secondary font-bold">
            Great Job!
          </span>
        </div>

        <h1 className="font-headline text-2xl font-bold uppercase tracking-tight text-primary drop-shadow-[0_2px_10px_rgba(0,255,135,0.25)]">
          Workout Complete!
        </h1>
        <p className="font-body text-xs text-on-surface-variant">{questTitle}</p>

        {/* Milestone Promotion Banner */}
        <div className="mt-2 w-full bg-gradient-to-r from-secondary-container/25 via-secondary-container/15 to-secondary-container/25 p-3 rounded-xl border border-secondary/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary-container text-surface-container-lowest font-bold text-sm shadow">
              ★
            </span>
            <div className="text-left">
              <div className="font-mono text-[10px] uppercase tracking-wider text-secondary font-bold">
                Level Up!
              </div>
              <div className="font-headline text-sm font-semibold text-on-surface">
                Level {oldLevel} ➔{' '}
                <span className="text-primary-container font-bold">Level {newLevel}</span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <span className="font-mono text-[9px] uppercase text-on-surface-variant block">
              Rank Achieved
            </span>
            <span className="font-headline text-xs font-bold text-secondary tracking-tight">
              {newRank}
            </span>
          </div>
        </div>
      </div>

      {/* 2. XP Earned Telemetry Card */}
      <div className="rounded-2xl bg-surface-container-low p-4 space-y-3 border border-outline-variant/30 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary-container text-lg">bolt</span>
            <span className="font-headline text-sm font-bold text-on-surface">XP Earned</span>
          </div>
          <span className="font-mono text-[10px] text-primary-container uppercase tracking-wider bg-surface-container-high px-2 py-0.5 rounded font-bold border border-primary-container/20">
            +18% Today
          </span>
        </div>

        {/* Big Counter */}
        <div className="flex flex-col items-center justify-center py-3 bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-inner">
          <div className="font-headline text-3xl font-bold text-primary-container tracking-tight drop-shadow-[0_0_12px_rgba(0,255,135,0.4)]">
            +{formatXP(totalXP)} XP
          </div>
          <span className="font-mono text-[11px] text-on-surface-variant mt-0.5">
            Total Points Earned
          </span>
        </div>

        {/* Progress Runway to Next Level */}
        <div className="space-y-1 font-mono text-xs">
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-on-surface-variant">
              {formatXP(userStats.currentXP)} / {formatXP(userStats.xpToNextLevel)} XP to Level{' '}
              {userStats.level + 1}
            </span>
            <span className="text-primary-container font-semibold">{xpPercent}%</span>
          </div>
          <div className="h-2.5 w-full bg-surface-container-lowest rounded-full overflow-hidden p-0.5 border border-outline-variant/20">
            <div
              className="h-full bg-primary-container rounded-full shadow-[0_0_8px_rgba(0,255,135,0.7)] transition-all duration-500"
              style={{ width: `${xpPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Itemized XP Table */}
        <div className="space-y-1.5 pt-1 font-mono text-xs">
          <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-high/60">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-outline"></span>
              <span className="font-body text-xs text-on-surface">Base Workout</span>
            </div>
            <span className="font-mono font-bold text-on-surface">+{baseXP} XP</span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-high/60">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
              <span className="font-body text-xs text-on-surface">
                {userStats.dayStreak}-Day Streak Bonus
              </span>
            </div>
            <span className="font-mono font-bold text-secondary">+{streakBonusXP} XP</span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-high/60">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-container"></span>
              <span className="font-body text-xs text-on-surface">Good Form & Tempo Bonus</span>
            </div>
            <span className="font-mono font-bold text-primary-container">+{formBonusXP} XP</span>
          </div>
        </div>
      </div>

      {/* 3. Stat Gains Matrix */}
      <div className="rounded-2xl bg-surface-container-low p-4 space-y-2.5 border border-outline-variant/30 shadow-md">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-primary-container text-[18px]">
            trending_up
          </span>
          <span className="font-headline text-sm font-bold text-on-surface">Stat Gains</span>
        </div>

        <div className="grid grid-cols-3 gap-2 font-mono">
          <div className="bg-surface-container-high rounded-xl p-2.5 text-center border border-outline-variant/20">
            <span className="text-[10px] text-on-surface-variant uppercase block">Strength</span>
            <span className="font-headline text-lg font-bold text-primary-container">
              +{strengthGain}
            </span>
            <span className="text-[9px] text-primary-fixed-dim uppercase tracking-wider block">
              Power Up
            </span>
          </div>

          <div className="bg-surface-container-high rounded-xl p-2.5 text-center border border-outline-variant/20">
            <span className="text-[10px] text-on-surface-variant uppercase block">Stamina</span>
            <span className="font-headline text-lg font-bold text-tertiary-fixed-dim">
              +{staminaGain}
            </span>
            <span className="text-[9px] text-tertiary-fixed-dim uppercase tracking-wider block">
              Endurance
            </span>
          </div>

          <div className="bg-surface-container-high rounded-xl p-2.5 text-center border border-outline-variant/20">
            <span className="text-[10px] text-on-surface-variant uppercase block">Streak</span>
            <span className="font-headline text-lg font-bold text-secondary">
              {userStats.dayStreak}D
            </span>
            <span className="text-[9px] text-secondary uppercase tracking-wider block">
              Days Strong
            </span>
          </div>
        </div>
      </div>

      {/* 4. Unlocked Rewards & Perks */}
      <div className="rounded-2xl bg-surface-container-low p-4 space-y-2.5 border border-outline-variant/30 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-secondary text-[18px]">military_tech</span>
            <span className="font-headline text-sm font-bold text-on-surface">Rewards</span>
          </div>
          <span className="font-mono text-[10px] text-secondary bg-surface-container-high px-2 py-0.5 rounded font-bold">
            Unlocked
          </span>
        </div>

        {/* Badge Card */}
        {badgeUnlocked && (
          <div className="p-3 bg-surface-container-high rounded-xl flex items-center gap-3 border border-outline-variant/30">
            <div className="w-10 h-10 rounded-xl bg-secondary-container/20 flex items-center justify-center text-secondary text-xl">
              🏅
            </div>
            <div className="min-w-0">
              <div className="font-headline text-xs font-bold text-on-surface truncate">
                New Badge Unlocked: {badgeUnlocked}
              </div>
              <div className="font-body text-[11px] text-on-surface-variant mt-0.5">
                Completed all workout sets with high volume
              </div>
            </div>
          </div>
        )}

        {/* Spend Stat Point Banner */}
        {userStats.statPoints > 0 && (
          <div className="p-3 bg-primary-container/15 rounded-xl flex items-center justify-between border border-primary-container/40">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-primary-container text-[20px]">
                stars
              </span>
              <div>
                <div className="font-headline text-xs font-bold text-on-surface">
                  +{userStats.statPoints} Stat Points Ready
                </div>
                <div className="font-body text-[10px] text-on-surface-variant">
                  Upgrade Strength, Stamina, or Agility
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 font-mono text-xs">
              <button
                onClick={() => allocateStatPoint('strength')}
                className="px-2 py-1 rounded bg-primary-container text-surface-container-lowest font-bold text-[10px] active:scale-95"
                title="Add to Strength"
              >
                +STR
              </button>
              <button
                onClick={() => allocateStatPoint('stamina')}
                className="px-2 py-1 rounded bg-tertiary-container text-surface-container-lowest font-bold text-[10px] active:scale-95"
                title="Add to Stamina"
              >
                +STA
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 5. Workout Telemetry Metrics */}
      <div className="rounded-2xl bg-surface-container-low p-4 space-y-2.5 border border-outline-variant/30 shadow-md">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-primary-container text-[18px]">
            query_stats
          </span>
          <span className="font-headline text-sm font-bold text-on-surface">Workout Summary</span>
        </div>

        <div className="grid grid-cols-2 gap-2 font-mono">
          <div className="bg-surface-container-high rounded-xl p-3 flex flex-col justify-between border border-outline-variant/20">
            <span className="text-[10px] text-on-surface-variant uppercase flex items-center justify-between">
              Duration
              <span className="material-symbols-outlined text-[14px]">schedule</span>
            </span>
            <span className="font-headline text-lg font-bold text-on-surface mt-1">
              {durationMins} min
            </span>
          </div>

          <div className="bg-surface-container-high rounded-xl p-3 flex flex-col justify-between border border-outline-variant/20">
            <span className="text-[10px] text-on-surface-variant uppercase flex items-center justify-between">
              Calories
              <span className="text-secondary text-[12px]">🔥</span>
            </span>
            <span className="font-headline text-lg font-bold text-secondary mt-1">
              {calories} kcal
            </span>
          </div>

          <div className="bg-surface-container-high rounded-xl p-3 flex flex-col justify-between border border-outline-variant/20">
            <span className="text-[10px] text-on-surface-variant uppercase flex items-center justify-between">
              Total Volume
              <span className="material-symbols-outlined text-[14px]">fitness_center</span>
            </span>
            <span className="font-headline text-lg font-bold text-on-surface mt-1">
              {formatXP(volumeKg)} kg
            </span>
          </div>

          <div className="bg-surface-container-high rounded-xl p-3 flex flex-col justify-between border border-outline-variant/20">
            <span className="text-[10px] text-on-surface-variant uppercase flex items-center justify-between">
              Avg Heart Rate
              <span className="text-error text-[12px]">❤️</span>
            </span>
            <span className="font-headline text-lg font-bold text-on-surface mt-1">
              {avgHeartRate} bpm
            </span>
          </div>
        </div>
      </div>

      {/* 6. Primary Action Buttons */}
      <div className="space-y-2 pt-1">
        <button
          onClick={() => setCurrentTab('quests')}
          className="w-full h-12 bg-primary-container text-surface-container-lowest font-headline font-bold text-sm rounded-2xl flex items-center justify-center gap-2 shadow-neon-glow active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
          <span>Continue</span>
        </button>

        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: 'AetherFit RPG Victory',
                text: `I just earned +${totalXP} XP and leveled up in AetherFit RPG!`,
              });
            } else {
              alert('Workout results copied to clipboard!');
            }
          }}
          className="w-full h-11 bg-surface-container-high text-on-surface font-headline font-semibold text-xs rounded-2xl flex items-center justify-center gap-1.5 border border-outline-variant/30 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">share</span>
          <span>Share Workout</span>
        </button>
      </div>
    </div>
  );
};
