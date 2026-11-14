export type NavTab = 'quests' | 'muscles' | 'results' | 'leaderboard' | 'profile';

export type EffortLevel = 'high' | 'moderate' | 'rested';

export type MuscleView = 'front' | 'back';

export interface MuscleGroup {
  id: string;
  name: string;
  secondaryName: string;
  view: MuscleView;
  effort: EffortLevel;
  sets: number;
  exercises: string[];
  recoveryTotalHours: number;
  recoveryHoursLeft: number;
  lastWorked: string | null;
  // Position percentage on the dual anatomical image (0-100%)
  coordinates: {
    x: number;
    y: number;
  };
}

export interface QuestExercise {
  name: string;
  sets: number;
  reps: number;
  weightKg?: number;
}

export interface Quest {
  id: string;
  title: string;
  subtitle: string;
  category: 'recommended' | 'routine' | 'steps' | 'weekly' | 'custom';
  xpReward: number;
  durationMins: number;
  targetMuscles: string[]; // muscle group IDs
  completed: boolean;
  progress: number;
  goal: number;
  exercises: QuestExercise[];
}

export interface UserStats {
  name: string;
  avatarUrl: string;
  level: number;
  currentXP: number;
  xpToNextLevel: number;
  totalXP: number;
  dayStreak: number;
  rankTitle: string;
  workoutsCompleted: number;
  statPoints: number;
  attributes: {
    strength: number;
    stamina: number;
    agility: number;
    willpower: number;
  };
  equippedGear: {
    head: string;
    outfit: string;
    aura: string;
  };
  unlockedBadges: string[];
}

export interface WorkoutSessionResult {
  questId: string;
  questTitle: string;
  targetMuscles: string[];
  baseXP: number;
  streakBonusXP: number;
  formBonusXP: number;
  totalXP: number;
  leveledUp: boolean;
  oldLevel: number;
  newLevel: number;
  oldRank: string;
  newRank: string;
  strengthGain: number;
  staminaGain: number;
  durationMins: number;
  calories: number;
  volumeKg: number;
  avgHeartRate: number;
  badgeUnlocked?: string;
  completedAt: string;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  avatarUrl: string;
  xp: number;
  division: string;
  isUser: boolean;
  badge?: string;
  diffFromUser?: string;
}
