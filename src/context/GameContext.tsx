import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  NavTab,
  UserStats,
  Quest,
  MuscleGroup,
  LeaderboardEntry,
  WorkoutSessionResult,
} from '../types';
import {
  initialUserStats,
  initialQuests,
  initialMuscleGroups,
  initialLeaderboard,
} from '../data/initialData';
import { calculateXPProgression } from '../utils/levelCalculator';

interface GameContextType {
  currentTab: NavTab;
  setCurrentTab: (tab: NavTab) => void;
  userStats: UserStats;
  quests: Quest[];
  muscleGroups: MuscleGroup[];
  leaderboard: LeaderboardEntry[];
  lastWorkoutResult: WorkoutSessionResult | null;
  activeWorkoutQuest: Quest | null;
  isLevelUpModalOpen: boolean;
  levelUpData: {
    oldLevel: number;
    newLevel: number;
    oldRank: string;
    newRank: string;
    pointsAwarded: number;
  } | null;
  selectedMuscleId: string | null;
  setSelectedMuscleId: (id: string | null) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  setTheme: (theme: 'dark' | 'light') => void;
  sessionStartTime: number;
  totalLoginSeconds: number;
  isPhoneSimulator: boolean;
  togglePhoneSimulator: () => void;
  startWorkout: (questId: string) => void;
  cancelWorkout: () => void;
  completeWorkout: (
    questId: string,
    overrideStats?: { durationMins?: number; calories?: number; volumeKg?: number }
  ) => void;
  claimDayXP: () => void;
  closeLevelUpModal: () => void;
  allocateStatPoint: (stat: 'strength' | 'stamina' | 'agility' | 'willpower') => void;
  addCustomQuest: (newQuest: Omit<Quest, 'id' | 'completed' | 'progress'>) => void;
  logMuscleWorkout: (muscleId: string) => void;
  resetMuscleStrain: (muscleId: string) => void;
  resetAllData: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('aetherfit_theme') as 'dark' | 'light') || 'dark';
  });

  // Track session login timestamp
  const [sessionStartTime] = useState<number>(() => {
    const existing = sessionStorage.getItem('aetherfit_session_start');
    if (existing) return Number(existing);
    const now = Date.now();
    sessionStorage.setItem('aetherfit_session_start', String(now));
    return now;
  });

  // Track cumulative time logged in across sessions
  const [totalLoginSeconds, setTotalLoginSeconds] = useState<number>(() => {
    const existing = localStorage.getItem('aetherfit_total_login_secs');
    return existing ? Number(existing) : 52800; // default to ~14h 40m based on 18-day history
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTotalLoginSeconds((prev) => {
        const next = prev + 1;
        localStorage.setItem('aetherfit_total_login_secs', String(next));
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Phone frame simulator toggle
  const [isPhoneSimulator, setIsPhoneSimulator] = useState<boolean>(() => {
    const saved = localStorage.getItem('aetherfit_simulator');
    return saved !== null ? saved === 'true' : true;
  });

  // Tab State
  const [currentTab, setCurrentTab] = useState<NavTab>('quests');

  // Selected Muscle in heatmap
  const [selectedMuscleId, setSelectedMuscleId] = useState<string | null>('chest');

  // Core Game Entities with localStorage
  const [userStats, setUserStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('aetherfit_user');
    return saved ? JSON.parse(saved) : initialUserStats;
  });

  const [quests, setQuests] = useState<Quest[]>(() => {
    const saved = localStorage.getItem('aetherfit_quests');
    return saved ? JSON.parse(saved) : initialQuests;
  });

  const [muscleGroups, setMuscleGroups] = useState<MuscleGroup[]>(() => {
    const saved = localStorage.getItem('aetherfit_muscles');
    return saved ? JSON.parse(saved) : initialMuscleGroups;
  });

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => {
    const saved = localStorage.getItem('aetherfit_leaderboard');
    return saved ? JSON.parse(saved) : initialLeaderboard;
  });

  const [lastWorkoutResult, setLastWorkoutResult] = useState<WorkoutSessionResult | null>(() => {
    const saved = localStorage.getItem('aetherfit_last_result');
    return saved ? JSON.parse(saved) : null;
  });

  const [activeWorkoutQuest, setActiveWorkoutQuest] = useState<Quest | null>(null);

  const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);
  const [levelUpData, setLevelUpData] = useState<{
    oldLevel: number;
    newLevel: number;
    oldRank: string;
    newRank: string;
    pointsAwarded: number;
  } | null>(null);

  // Sync theme with DOM
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    localStorage.setItem('aetherfit_theme', theme);
  }, [theme]);

  // Sync simulator setting
  useEffect(() => {
    localStorage.setItem('aetherfit_simulator', String(isPhoneSimulator));
  }, [isPhoneSimulator]);

  // Sync user stats
  useEffect(() => {
    localStorage.setItem('aetherfit_user', JSON.stringify(userStats));
  }, [userStats]);

  // Sync quests
  useEffect(() => {
    localStorage.setItem('aetherfit_quests', JSON.stringify(quests));
  }, [quests]);

  // Sync muscles
  useEffect(() => {
    localStorage.setItem('aetherfit_muscles', JSON.stringify(muscleGroups));
  }, [muscleGroups]);

  // Sync leaderboard
  useEffect(() => {
    localStorage.setItem('aetherfit_leaderboard', JSON.stringify(leaderboard));
  }, [leaderboard]);

  // Sync last result
  useEffect(() => {
    if (lastWorkoutResult) {
      localStorage.setItem('aetherfit_last_result', JSON.stringify(lastWorkoutResult));
    }
  }, [lastWorkoutResult]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const togglePhoneSimulator = () => {
    setIsPhoneSimulator((prev) => !prev);
  };

  const startWorkout = (questId: string) => {
    const targetQuest = quests.find((q) => q.id === questId);
    if (targetQuest) {
      setActiveWorkoutQuest(targetQuest);
    }
  };

  const cancelWorkout = () => {
    setActiveWorkoutQuest(null);
  };

  const completeWorkout = (
    questId: string,
    overrideStats?: { durationMins?: number; calories?: number; volumeKg?: number }
  ) => {
    const quest = quests.find((q) => q.id === questId);
    if (!quest) return;

    // Calculate XP bonuses
    const baseXP = quest.xpReward;
    const streakBonusXP = 150;
    const formBonusXP = 100;
    const totalEarnedXP = baseXP + streakBonusXP + formBonusXP;

    // Progression calculation
    const progression = calculateXPProgression(
      userStats.level,
      userStats.currentXP,
      totalEarnedXP
    );

    const oldLevel = userStats.level;
    const newLevel = progression.newLevel;
    const leveledUp = progression.leveledUp;
    const strengthGain = quest.targetMuscles.includes('chest') ? 2 : 1;
    const staminaGain = 1;

    // Prepare workout session result
    const result: WorkoutSessionResult = {
      questId: quest.id,
      questTitle: quest.title,
      targetMuscles: quest.targetMuscles,
      baseXP,
      streakBonusXP,
      formBonusXP,
      totalXP: totalEarnedXP,
      leveledUp,
      oldLevel,
      newLevel,
      oldRank: progression.oldRank,
      newRank: progression.newRank,
      strengthGain,
      staminaGain,
      durationMins: overrideStats?.durationMins || quest.durationMins || 45,
      calories: overrideStats?.calories || 420,
      volumeKg: overrideStats?.volumeKg || 12650,
      avgHeartRate: 138,
      badgeUnlocked: quest.targetMuscles.includes('chest') ? 'Bench Master' : 'Iron Will',
      completedAt: new Date().toISOString(),
    };

    setLastWorkoutResult(result);
    setActiveWorkoutQuest(null);

    // Update User Stats
    setUserStats((prev) => ({
      ...prev,
      level: newLevel,
      currentXP: progression.newCurrentXP,
      xpToNextLevel: progression.newRequiredXP,
      totalXP: prev.totalXP + totalEarnedXP,
      dayStreak: prev.dayStreak + 1,
      rankTitle: progression.newRank,
      workoutsCompleted: prev.workoutsCompleted + 1,
      statPoints: prev.statPoints + (leveledUp ? progression.levelsGained * 2 : 0),
      attributes: {
        ...prev.attributes,
        strength: prev.attributes.strength + strengthGain,
        stamina: prev.attributes.stamina + staminaGain,
      },
      unlockedBadges:
        result.badgeUnlocked && !prev.unlockedBadges.includes(result.badgeUnlocked)
          ? [...prev.unlockedBadges, result.badgeUnlocked]
          : prev.unlockedBadges,
    }));

    // Mark quest completed and update weekly challenge progress
    setQuests((prev) =>
      prev.map((q) => {
        if (q.id === questId) {
          return { ...q, completed: true, progress: q.goal };
        }
        if (q.category === 'weekly') {
          const nextProgress = Math.min(q.goal, q.progress + 1);
          return {
            ...q,
            progress: nextProgress,
            completed: nextProgress >= q.goal,
          };
        }
        return q;
      })
    );

    // Update muscle groups with high/moderate strain
    setMuscleGroups((prev) =>
      prev.map((m) => {
        if (quest.targetMuscles.includes(m.id)) {
          return {
            ...m,
            effort: m.id === quest.targetMuscles[0] ? 'high' : 'moderate',
            sets: m.sets + 4,
            recoveryHoursLeft: m.recoveryTotalHours,
            lastWorked: 'Today',
            exercises: [...new Set([...m.exercises, ...quest.exercises.map((e) => e.name)])],
          };
        }
        return m;
      })
    );

    // Update Leaderboard with Alex's new score
    setLeaderboard((prev) => {
      const updated = prev.map((entry) => {
        if (entry.isUser) {
          return { ...entry, xp: entry.xp + totalEarnedXP };
        }
        return entry;
      });
      // Sort by XP descending
      updated.sort((a, b) => b.xp - a.xp);
      // Re-assign ranks
      return updated.map((item, idx) => ({ ...item, rank: idx + 1 }));
    });

    // Switch to Results Screen
    setCurrentTab('results');

    // Trigger Level Up Modal if level increased
    if (leveledUp) {
      setLevelUpData({
        oldLevel,
        newLevel,
        oldRank: progression.oldRank,
        newRank: progression.newRank,
        pointsAwarded: progression.levelsGained * 2,
      });

      setTimeout(() => {
        setIsLevelUpModalOpen(true);
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#00ff87', '#ffb95f', '#7bd0ff'],
        });
      }, 700);
    }
  };

  const claimDayXP = () => {
    const bonusXP = 210;
    const progression = calculateXPProgression(
      userStats.level,
      userStats.currentXP,
      bonusXP
    );

    setUserStats((prev) => ({
      ...prev,
      level: progression.newLevel,
      currentXP: progression.newCurrentXP,
      xpToNextLevel: progression.newRequiredXP,
      totalXP: prev.totalXP + bonusXP,
      rankTitle: progression.newRank,
    }));

    confetti({
      particleCount: 60,
      spread: 50,
      origin: { y: 0.7 },
      colors: ['#00ff87', '#ffb95f'],
    });
  };

  const closeLevelUpModal = () => {
    setIsLevelUpModalOpen(false);
  };

  const allocateStatPoint = (stat: 'strength' | 'stamina' | 'agility' | 'willpower') => {
    if (userStats.statPoints <= 0) return;
    setUserStats((prev) => ({
      ...prev,
      statPoints: prev.statPoints - 1,
      attributes: {
        ...prev.attributes,
        [stat]: prev.attributes[stat] + 1,
      },
    }));
  };

  const addCustomQuest = (newQuest: Omit<Quest, 'id' | 'completed' | 'progress'>) => {
    const quest: Quest = {
      ...newQuest,
      id: `quest-custom-${Date.now()}`,
      completed: false,
      progress: 0,
    };
    setQuests((prev) => [quest, ...prev]);
  };

  const logMuscleWorkout = (muscleId: string) => {
    setMuscleGroups((prev) =>
      prev.map((m) => {
        if (m.id === muscleId) {
          return {
            ...m,
            effort: 'high',
            sets: m.sets + 4,
            recoveryHoursLeft: m.recoveryTotalHours,
            lastWorked: 'Today',
            exercises:
              m.exercises.length > 0
                ? m.exercises
                : [`${m.name.split(' ')[0]} Target Sets`],
          };
        }
        return m;
      })
    );

    setUserStats((prev) => ({
      ...prev,
      workoutsCompleted: prev.workoutsCompleted + 1,
      totalXP: prev.totalXP + 150,
      currentXP: prev.currentXP + 150,
    }));

    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#00ff87', '#39b8fd'],
    });
  };

  const resetMuscleStrain = (muscleId: string) => {
    setMuscleGroups((prev) =>
      prev.map((m) => {
        if (m.id === muscleId) {
          return {
            ...m,
            effort: 'rested',
            sets: 0,
            recoveryHoursLeft: 0,
            lastWorked: 'Rested',
          };
        }
        return m;
      })
    );
  };

  const resetAllData = () => {
    localStorage.clear();
    setUserStats(initialUserStats);
    setQuests(initialQuests);
    setMuscleGroups(initialMuscleGroups);
    setLeaderboard(initialLeaderboard);
    setLastWorkoutResult(null);
    setCurrentTab('quests');
    setSelectedMuscleId('chest');
  };

  return (
    <GameContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        userStats,
        quests,
        muscleGroups,
        leaderboard,
        lastWorkoutResult,
        activeWorkoutQuest,
        isLevelUpModalOpen,
        levelUpData,
        selectedMuscleId,
        setSelectedMuscleId,
        theme,
        toggleTheme,
        setTheme,
        sessionStartTime,
        totalLoginSeconds,
        isPhoneSimulator,
        togglePhoneSimulator,
        startWorkout,
        cancelWorkout,
        completeWorkout,
        claimDayXP,
        closeLevelUpModal,
        allocateStatPoint,
        addCustomQuest,
        logMuscleWorkout,
        resetMuscleStrain,
        resetAllData,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
