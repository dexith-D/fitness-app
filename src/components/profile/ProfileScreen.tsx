import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import {
  Sun,
  Moon,
  Clock,
  CheckCircle2,
  Flame,
  Trophy,
  Award,
  Target,
  Gift,
  Lock,
  Check,
} from 'lucide-react';
import { getLevelInfo, LEVEL_TIERS } from '../../utils/levelCalculator';

export const ProfileScreen: React.FC = () => {
  const { userStats, quests, theme, setTheme, sessionStartTime, totalLoginSeconds } = useGame();
  const [selectedTierTab, setSelectedTierTab] = useState<number>(2); // Default to Tier 2 where Alex starts

  // Live session elapsed seconds
  const [sessionSeconds, setSessionSeconds] = useState<number>(() => {
    return Math.max(0, Math.floor((Date.now() - sessionStartTime) / 1000));
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setSessionSeconds(Math.max(0, Math.floor((Date.now() - sessionStartTime) / 1000)));
    }, 1000);
    return () => clearInterval(timer);
  }, [sessionStartTime]);

  const currentLevelInfo = getLevelInfo(userStats.level);

  // Set the default selected tier tab to the player's current tier on load
  useEffect(() => {
    setSelectedTierTab(currentLevelInfo.tierNumber);
  }, [currentLevelInfo.tierNumber]);

  // Format session time as "Xh Ym Zs" or "Xm Ys"
  const formatLiveDuration = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    if (hrs > 0) {
      return `${hrs}h ${mins}m ${secs.toString().padStart(2, '0')}s`;
    }
    return `${mins}m ${secs.toString().padStart(2, '0')}s`;
  };

  // Format cumulative logged in time
  const formatTotalTime = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    return `${hrs}h ${mins}m`;
  };

  const completedQuestsCount = quests.filter((q) => q.completed).length;
  const totalTasksCompleted = userStats.workoutsCompleted + completedQuestsCount;
  const xpPercentage = Math.min(
    100,
    Math.round((userStats.currentXP / userStats.xpToNextLevel) * 100)
  );

  const tiersSummary = [
    { number: 1, name: 'Chalk Dust', subtitle: 'Learning the Mechanics' },
    { number: 2, name: 'Tension Seeker', subtitle: 'Managing Fatigue' },
    { number: 3, name: 'Iron Forged', subtitle: 'Consistency & Heavy Loads' },
    { number: 4, name: 'Gravity Breaker', subtitle: 'Elite Execution' },
    { number: 5, name: 'Atlas', subtitle: 'Absolute Mastery' },
  ];

  const levelsInSelectedTier = LEVEL_TIERS.filter((l) => l.tierNumber === selectedTierTab);

  return (
    <div className="flex-1 w-full overflow-y-auto pb-24 px-4 pt-3 space-y-4">
      {/* 1. User Identity & Rank Hero Card */}
      <div className="w-full bg-gradient-to-br from-surface-container-high via-surface-container to-surface-container-low p-4 rounded-3xl border border-outline-variant/30 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex items-center gap-3.5 relative z-10">
          <div className="relative">
            <img
              src={userStats.avatarUrl}
              alt={userStats.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-primary-container/70 shadow-md"
            />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-primary-container ring-2 ring-surface-container flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-surface-container-lowest"></span>
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="font-headline text-lg font-bold text-on-surface truncate">
                {userStats.name}
              </h2>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-primary-container/20 text-primary-container border border-primary-container/30 font-bold shrink-0">
                Lvl {userStats.level}
              </span>
            </div>

            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="font-mono text-[11px] font-bold text-primary-container">
                Tier {currentLevelInfo.tierNumber}: {currentLevelInfo.tierName}
              </span>
              <span className="text-on-surface-variant text-[10px]">•</span>
              <span className="font-mono text-[11px] text-secondary font-bold truncate">
                {userStats.rankTitle}
              </span>
            </div>

            <div className="flex items-center gap-2 mt-1 text-[11px] font-mono text-on-surface-variant">
              <span className="flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-secondary" />
                {userStats.dayStreak} Day Streak
              </span>
              <span>•</span>
              <span className="text-primary-container flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse"></span>
                Online
              </span>
            </div>
          </div>
        </div>

        {/* Level XP Progress Bar */}
        <div className="mt-4 pt-3 border-t border-outline-variant/20">
          <div className="flex justify-between items-center text-[11px] font-mono mb-1.5">
            <span className="text-on-surface-variant">Progress to Level {Math.min(15, userStats.level + 1)}</span>
            <span className="text-on-surface font-bold">
              {userStats.currentXP.toLocaleString()} / {userStats.xpToNextLevel.toLocaleString()} XP ({xpPercentage}%)
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-surface-container-lowest overflow-hidden border border-outline-variant/20 p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary-container to-secondary-container transition-all duration-500 shadow-neon-glow"
              style={{ width: `${xpPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Current Active Focus & Unlock Perk */}
        <div className="mt-3 pt-2.5 border-t border-outline-variant/15 space-y-1.5 text-xs font-mono">
          <div className="flex items-start gap-2 bg-surface-container-lowest/80 p-2 rounded-xl border border-outline-variant/15">
            <Target className="w-3.5 h-3.5 text-primary-container shrink-0 mt-0.5" />
            <div className="min-w-0">
              <span className="text-[10px] text-primary-container font-bold uppercase block">Current Tier Focus</span>
              <p className="text-[11px] text-on-surface-variant font-body leading-tight">
                {currentLevelInfo.focus}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2 bg-surface-container-lowest/80 p-2 rounded-xl border border-outline-variant/15">
            <Gift className="w-3.5 h-3.5 text-secondary shrink-0 mt-0.5" />
            <div className="min-w-0">
              <span className="text-[10px] text-secondary font-bold uppercase block">Unlocked Level Perk</span>
              <p className="text-[11px] text-on-surface-variant font-body leading-tight">
                {currentLevelInfo.unlock}
              </p>
            </div>
          </div>
        </div>

        {/* Attribute Pills */}
        <div className="grid grid-cols-4 gap-2 mt-3 font-mono text-center">
          <div className="bg-surface-container-lowest/70 p-1.5 rounded-xl border border-outline-variant/15">
            <div className="text-[9px] text-on-surface-variant uppercase">STR</div>
            <div className="text-xs font-bold text-on-surface">{userStats.attributes.strength}</div>
          </div>
          <div className="bg-surface-container-lowest/70 p-1.5 rounded-xl border border-outline-variant/15">
            <div className="text-[9px] text-on-surface-variant uppercase">STA</div>
            <div className="text-xs font-bold text-on-surface">{userStats.attributes.stamina}</div>
          </div>
          <div className="bg-surface-container-lowest/70 p-1.5 rounded-xl border border-outline-variant/15">
            <div className="text-[9px] text-on-surface-variant uppercase">AGI</div>
            <div className="text-xs font-bold text-on-surface">{userStats.attributes.agility}</div>
          </div>
          <div className="bg-surface-container-lowest/70 p-1.5 rounded-xl border border-outline-variant/15">
            <div className="text-[9px] text-on-surface-variant uppercase">WIL</div>
            <div className="text-xs font-bold text-on-surface">{userStats.attributes.willpower}</div>
          </div>
        </div>
      </div>

      {/* 2. Interactive RPG Tier Roadmap & Level Breakdown */}
      <div className="w-full bg-surface-container-low p-4 rounded-3xl border border-outline-variant/25 shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-surface-container-high flex items-center justify-center text-primary-container border border-primary-container/20">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-headline text-sm font-bold text-on-surface">Progression Roadmap</h3>
              <p className="text-[10px] font-mono text-on-surface-variant">5 Tiers • 15 Mastery Levels</p>
            </div>
          </div>
          <span className="font-mono text-[10px] px-2.5 py-0.5 rounded-full bg-surface-container-high border border-outline-variant/30 text-on-surface font-semibold">
            Level {userStats.level} / 15
          </span>
        </div>

        {/* Tier Selector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar">
          {tiersSummary.map((tier) => {
            const isCurrent = currentLevelInfo.tierNumber === tier.number;
            const isSelected = selectedTierTab === tier.number;
            const isCompleted = userStats.level > tier.number * 3;

            return (
              <button
                key={tier.number}
                onClick={() => setSelectedTierTab(tier.number)}
                className={`flex-1 min-w-[70px] py-1.5 px-2 rounded-xl font-mono text-[10px] flex flex-col items-center justify-center border transition-all ${
                  isSelected
                    ? 'bg-primary-container text-surface-container-lowest font-bold shadow-neon-glow border-primary-container'
                    : isCurrent
                    ? 'bg-surface-container-high text-primary-container font-semibold border-primary-container/40'
                    : isCompleted
                    ? 'bg-surface-container-lowest text-on-surface border-outline-variant/30'
                    : 'bg-surface-container-lowest/60 text-outline border-outline-variant/20'
                }`}
              >
                <span>T{tier.number}</span>
                <span className="text-[8px] truncate max-w-[65px] opacity-90">
                  {tier.name.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Tier Banner */}
        <div className="p-2.5 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-primary-fixed-dim uppercase tracking-wider font-bold">
              Tier {selectedTierTab}: {tiersSummary[selectedTierTab - 1].name}
            </span>
            <p className="text-[11px] text-on-surface-variant font-body">
              {tiersSummary[selectedTierTab - 1].subtitle}
            </p>
          </div>
          <span className="font-mono text-[10px] text-outline">
            Levels {(selectedTierTab - 1) * 3 + 1} – {selectedTierTab * 3}
          </span>
        </div>

        {/* Level List inside Selected Tier */}
        <div className="space-y-2 pt-1 font-mono text-xs">
          {levelsInSelectedTier.map((lvl) => {
            const isUserLevel = userStats.level === lvl.level;
            const isUnlocked = userStats.level >= lvl.level;

            return (
              <div
                key={lvl.level}
                className={`p-3 rounded-2xl border transition-all ${
                  isUserLevel
                    ? 'bg-surface-container-high border-primary-container/60 shadow-md ring-1 ring-primary-container/30'
                    : isUnlocked
                    ? 'bg-surface-container-lowest border-outline-variant/30'
                    : 'bg-surface-container-lowest/50 border-outline-variant/15 opacity-70'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-[11px] ${
                        isUserLevel
                          ? 'bg-primary-container text-surface-container-lowest'
                          : isUnlocked
                          ? 'bg-surface-container-high text-primary-container'
                          : 'bg-surface-container text-outline'
                      }`}
                    >
                      {lvl.level}
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-headline font-bold text-on-surface text-xs">
                          {lvl.title}
                        </span>
                        {isUserLevel && (
                          <span className="text-[8px] bg-primary-container/20 text-primary-container px-1.5 rounded-full font-bold uppercase border border-primary-container/30">
                            Current Rank
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-outline">
                        {lvl.totalXP.toLocaleString()} XP Threshold
                      </span>
                    </div>
                  </div>

                  {isUserLevel ? (
                    <span className="text-primary-container text-xs">★ Active</span>
                  ) : isUnlocked ? (
                    <span className="text-secondary flex items-center gap-0.5 text-[10px]">
                      <Check className="w-3.5 h-3.5" /> Done
                    </span>
                  ) : (
                    <span className="text-outline flex items-center gap-0.5 text-[10px]">
                      <Lock className="w-3 h-3" /> Locked
                    </span>
                  )}
                </div>

                {/* Focus and Unlock Details */}
                <div className="mt-2 pt-2 border-t border-outline-variant/15 space-y-1 text-[11px] font-body">
                  <div className="flex items-start gap-1.5 text-on-surface-variant">
                    <Target className="w-3.5 h-3.5 text-primary-container shrink-0 mt-0.5" />
                    <span><strong className="text-on-surface">Focus:</strong> {lvl.focus}</span>
                  </div>
                  <div className="flex items-start gap-1.5 text-on-surface-variant">
                    <Gift className="w-3.5 h-3.5 text-secondary shrink-0 mt-0.5" />
                    <span><strong className="text-secondary">Unlock:</strong> {lvl.unlock}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Logged In Time Section */}
      <div className="w-full bg-surface-container-low p-4 rounded-3xl border border-outline-variant/25 shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-surface-container-high flex items-center justify-center text-primary-container border border-primary-container/20">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-headline text-sm font-bold text-on-surface">Logged In Time</h3>
              <p className="text-[10px] font-mono text-on-surface-variant">Active user session tracking</p>
            </div>
          </div>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-container/15 border border-primary-container/30 text-primary-container font-mono text-[10px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse"></span>
            Active
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          {/* Active Session Timer */}
          <div className="bg-surface-container-lowest p-3 rounded-2xl border border-outline-variant/20 flex flex-col justify-between">
            <div className="text-[11px] font-mono text-on-surface-variant mb-1 flex items-center gap-1">
              <span>⏱️</span> Current Session
            </div>
            <div className="font-mono text-lg font-bold text-primary-container tracking-tight">
              {formatLiveDuration(sessionSeconds)}
            </div>
            <div className="text-[9px] font-mono text-on-surface-variant mt-1">Live tracking</div>
          </div>

          {/* Total Cumulative Time */}
          <div className="bg-surface-container-lowest p-3 rounded-2xl border border-outline-variant/20 flex flex-col justify-between">
            <div className="text-[11px] font-mono text-on-surface-variant mb-1 flex items-center gap-1">
              <span>📅</span> Total Logged Time
            </div>
            <div className="font-mono text-lg font-bold text-on-surface tracking-tight">
              {formatTotalTime(totalLoginSeconds)}
            </div>
            <div className="text-[9px] font-mono text-on-surface-variant mt-1">Across 18 active days</div>
          </div>
        </div>
      </div>

      {/* 4. Number of Tasks Completed Section */}
      <div className="w-full bg-surface-container-low p-4 rounded-3xl border border-outline-variant/25 shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-surface-container-high flex items-center justify-center text-secondary border border-secondary/20">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-headline text-sm font-bold text-on-surface">Tasks Completed</h3>
              <p className="text-[10px] font-mono text-on-surface-variant">Workouts and fitness quests finished</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-secondary-container/20 border border-secondary/30 text-secondary font-mono text-xs font-bold">
            {totalTasksCompleted} Total
          </span>
        </div>

        {/* Big Tasks Hero Counter */}
        <div className="bg-surface-container-lowest p-3.5 rounded-2xl border border-outline-variant/20 flex items-center justify-between">
          <div>
            <div className="text-2xl font-headline font-bold text-on-surface flex items-baseline gap-1.5">
              <span>{totalTasksCompleted}</span>
              <span className="text-xs font-mono font-normal text-on-surface-variant">tasks finished</span>
            </div>
            <p className="text-[10px] font-mono text-primary-fixed-dim mt-0.5">
              Consistent daily execution & progress
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-primary-container/15 border border-primary-container/30 flex items-center justify-center text-primary-container">
            <Trophy className="w-6 h-6" />
          </div>
        </div>

        {/* Detailed breakdown metrics */}
        <div className="grid grid-cols-2 gap-2.5 font-mono text-xs">
          <div className="bg-surface-container-lowest/80 p-2.5 rounded-xl border border-outline-variant/15 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center text-primary-container text-xs font-bold">
              💪
            </div>
            <div>
              <div className="text-[10px] text-on-surface-variant">Workouts Done</div>
              <div className="font-bold text-on-surface">{userStats.workoutsCompleted} sessions</div>
            </div>
          </div>

          <div className="bg-surface-container-lowest/80 p-2.5 rounded-xl border border-outline-variant/15 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center text-secondary text-xs font-bold">
              🎯
            </div>
            <div>
              <div className="text-[10px] text-on-surface-variant">Quests Completed</div>
              <div className="font-bold text-on-surface">{completedQuestsCount} quests</div>
            </div>
          </div>

          <div className="bg-surface-container-lowest/80 p-2.5 rounded-xl border border-outline-variant/15 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center text-amber-400 text-xs font-bold">
              ⚡
            </div>
            <div>
              <div className="text-[10px] text-on-surface-variant">Total XP Gained</div>
              <div className="font-bold text-on-surface">{userStats.totalXP.toLocaleString()} XP</div>
            </div>
          </div>

          <div className="bg-surface-container-lowest/80 p-2.5 rounded-xl border border-outline-variant/15 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center text-purple-400 text-xs font-bold">
              🎖️
            </div>
            <div>
              <div className="text-[10px] text-on-surface-variant">Badges Earned</div>
              <div className="font-bold text-on-surface">{userStats.unlockedBadges.length} badges</div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Light and Dark Theme Switcher Section */}
      <div className="w-full bg-surface-container-low p-4 rounded-3xl border border-outline-variant/25 shadow-md space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-surface-container-high flex items-center justify-center text-primary-container border border-primary-container/20">
            {theme === 'dark' ? <Moon className="w-4 h-4 text-secondary" /> : <Sun className="w-4 h-4 text-secondary" />}
          </div>
          <div>
            <h3 className="font-headline text-sm font-bold text-on-surface">App Theme</h3>
            <p className="text-[10px] font-mono text-on-surface-variant">Switch between Light and Dark interface mode</p>
          </div>
        </div>

        {/* Theme Segmented Switcher Controls */}
        <div className="grid grid-cols-2 gap-2.5 bg-surface-container-lowest p-1.5 rounded-2xl border border-outline-variant/20">
          <button
            onClick={() => setTheme('light')}
            className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl font-headline text-xs font-bold transition-all ${
              theme === 'light'
                ? 'bg-primary-container text-surface-container-lowest shadow-neon-glow border border-primary-container'
                : 'text-on-surface-variant hover:text-on-surface bg-surface-container-high/40 hover:bg-surface-container-high'
            }`}
          >
            <Sun className="w-4 h-4 text-amber-500" />
            <span>Light Theme</span>
          </button>

          <button
            onClick={() => setTheme('dark')}
            className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl font-headline text-xs font-bold transition-all ${
              theme === 'dark'
                ? 'bg-primary-container text-surface-container-lowest shadow-neon-glow border border-primary-container'
                : 'text-on-surface-variant hover:text-on-surface bg-surface-container-high/40 hover:bg-surface-container-high'
            }`}
          >
            <Moon className="w-4 h-4 text-secondary" />
            <span>Dark Theme</span>
          </button>
        </div>

        <p className="text-[10px] font-mono text-center text-on-surface-variant">
          Currently active: <span className="font-bold text-on-surface uppercase">{theme} MODE</span>
        </p>
      </div>

      {/* 6. Unlocked Badges Showcase */}
      <div className="w-full bg-surface-container-low p-4 rounded-3xl border border-outline-variant/25 shadow-md space-y-2.5">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-primary-container" />
          <h3 className="font-headline text-sm font-bold text-on-surface">Unlocked Badges</h3>
        </div>
        <div className="flex flex-wrap gap-1.5 font-mono text-[10px]">
          {userStats.unlockedBadges.map((badge, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 rounded-xl bg-surface-container-lowest border border-outline-variant/25 text-on-surface flex items-center gap-1.5 shadow-sm"
            >
              <span className="text-secondary">✦</span>
              {badge}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
