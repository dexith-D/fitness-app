// 5-Tier, 15-Level Progression Hierarchy
export interface LevelTierInfo {
  level: number;
  tierNumber: number;
  tierName: string;
  tierLevel: number; // 1, 2, or 3
  title: string;
  totalXP: number; // Cumulative threshold to reach this level
  requiredXPToNext: number; // XP delta needed to advance to the next level
  focus: string;
  unlock: string;
}

export const LEVEL_TIERS: LevelTierInfo[] = [
  // ==================== TIER 1: CHALK DUST (Learning the Mechanics) ====================
  {
    level: 1,
    tierNumber: 1,
    tierName: 'Chalk Dust',
    tierLevel: 1,
    title: 'Empty Bar',
    totalXP: 0,
    requiredXPToNext: 1500,
    focus: 'Navigating the gym, understanding the basic controls, and completing the tutorial.',
    unlock: 'Basic cotton t-shirt and shorts.',
  },
  {
    level: 2,
    tierNumber: 1,
    tierName: 'Chalk Dust',
    tierLevel: 2,
    title: 'Form Student',
    totalXP: 1500,
    requiredXPToNext: 2000,
    focus: 'Hitting "Good" timing on easy rep mini-games. Learning not to spam inputs.',
    unlock: 'Plastic shaker bottle (provides a small stamina regeneration boost between sets).',
  },
  {
    level: 3,
    tierNumber: 1,
    tierName: 'Chalk Dust',
    tierLevel: 3,
    title: 'Chalk Dust',
    totalXP: 3500,
    requiredXPToNext: 2500,
    focus: 'Stringing together full sets without failing a rep.',
    unlock: 'Basic weightlifting belt and access to the intermediate free-weight zone.',
  },

  // ==================== TIER 2: TENSION SEEKER (Managing Fatigue) ====================
  {
    level: 4,
    tierNumber: 2,
    tierName: 'Tension Seeker',
    tierLevel: 1,
    title: 'The Pumper',
    totalXP: 6000,
    requiredXPToNext: 3000,
    focus: 'Managing the stamina bar during longer sets and surviving endurance challenges.',
    unlock: 'Pre-workout supplement (a usable item that temporarily slows down stamina drain).',
  },
  {
    level: 5,
    tierNumber: 2,
    tierName: 'Tension Seeker',
    tierLevel: 2,
    title: 'Hypertrophy Hunter',
    totalXP: 9000,
    requiredXPToNext: 4000,
    focus: 'Hitting "Perfect" input timings while the stamina bar is flashing red (simulating muscle fatigue).',
    unlock: 'Upgraded cross-training shoes for better stability mini-game stats.',
  },
  {
    level: 6,
    tierNumber: 2,
    tierName: 'Tension Seeker',
    tierLevel: 3,
    title: 'Tension Seeker',
    totalXP: 13000,
    requiredXPToNext: 5000,
    focus: 'Completing full compound movement routines (combining multiple mini-games back-to-back).',
    unlock: 'Leather lifting straps (forgives one missed grip input per workout) and a custom gym bag.',
  },

  // ==================== TIER 3: IRON FORGED (Consistency and Heavy Loads) ====================
  {
    level: 7,
    tierNumber: 3,
    tierName: 'Iron Forged',
    tierLevel: 1,
    title: 'Plate Rattler',
    totalXP: 18000,
    requiredXPToNext: 6000,
    focus: 'Speed and accuracy on heavy 5-rep max challenges.',
    unlock: 'Knee sleeves (reduces the penalty for slightly early/late inputs on squat mechanics).',
  },
  {
    level: 8,
    tierNumber: 3,
    tierName: 'Iron Forged',
    tierLevel: 2,
    title: 'Steel Bent',
    totalXP: 24000,
    requiredXPToNext: 8000,
    focus: '"Grinding" reps—rapid-tap recovery mechanics when a lift starts to fail.',
    unlock: 'Premium gym membership card (unlocks a visually grittier, hardcore gym environment like a basement powerlifting club).',
  },
  {
    level: 9,
    tierNumber: 3,
    tierName: 'Iron Forged',
    tierLevel: 3,
    title: 'Iron Forged',
    totalXP: 32000,
    requiredXPToNext: 10000,
    focus: 'Flawless execution across a full 45-minute workout session without dropping a single weight.',
    unlock: 'A customized weightlifting singlet and a personalized player title plate.',
  },

  // ==================== TIER 4: GRAVITY BREAKER (Elite Execution) ====================
  {
    level: 10,
    tierNumber: 4,
    tierName: 'Gravity Breaker',
    tierLevel: 1,
    title: 'Force Producer',
    totalXP: 42000,
    requiredXPToNext: 13000,
    focus: 'Explosive input timing; the mini-games require fast twitch reflexes rather than just rhythm.',
    unlock: 'Golden chalk bowl for the player\'s personal lifting platform.',
  },
  {
    level: 11,
    tierNumber: 4,
    tierName: 'Gravity Breaker',
    tierLevel: 2,
    title: 'Mass Mover',
    totalXP: 55000,
    requiredXPToNext: 15000,
    focus: 'Beating the "1-Rep Max" boss challenges—zero margin for error, one shot to get the sequence perfect.',
    unlock: 'VIP locker room access and exclusive heavy-duty lever belts.',
  },
  {
    level: 12,
    tierNumber: 4,
    tierName: 'Gravity Breaker',
    tierLevel: 3,
    title: 'Gravity Breaker',
    totalXP: 70000,
    requiredXPToNext: 20000,
    focus: 'Setting high scores on the server leaderboards and maintaining peak performance over time.',
    unlock: 'A subtle visual aura (like steam or heat waves coming off the avatar\'s shoulders) that other players can see.',
  },

  // ==================== TIER 5: ATLAS (Absolute Mastery) ====================
  {
    level: 13,
    tierNumber: 5,
    tierName: 'Atlas',
    tierLevel: 1,
    title: 'Titan',
    totalXP: 90000,
    requiredXPToNext: 30000,
    focus: 'Server-wide dominance. Completing weekly elite challenges that scale in difficulty based on the player\'s stats.',
    unlock: 'A bronze statue of the player\'s avatar in the main lobby.',
  },
  {
    level: 14,
    tierNumber: 5,
    tierName: 'Atlas',
    tierLevel: 2,
    title: 'Colossus',
    totalXP: 120000,
    requiredXPToNext: 30000,
    focus: 'Consistency. If players stop logging in or fail elite challenges, their XP decays back to Titan.',
    unlock: 'The statue upgrades to silver; ability to set custom workout routines for lower-level players to attempt.',
  },
  {
    level: 15,
    tierNumber: 5,
    tierName: 'Atlas',
    tierLevel: 3,
    title: 'The Atlas',
    totalXP: 150000,
    requiredXPToNext: 35000,
    focus: 'Absolute mechanical perfection. You have beaten every lifting simulation the game offers.',
    unlock: 'The gold statue, a permanent spot in the server\'s Hall of Fame, and a custom animation where the player casually throws a 45lb plate upon entering a room.',
  },
];

// Look up level info by level number (1 - 15)
export function getLevelInfo(level: number): LevelTierInfo {
  const clampedLevel = Math.max(1, Math.min(level, LEVEL_TIERS.length));
  return LEVEL_TIERS[clampedLevel - 1];
}

// Find level tier info from cumulative total XP
export function getLevelFromTotalXP(totalXP: number): LevelTierInfo {
  let matched = LEVEL_TIERS[0];
  for (let i = LEVEL_TIERS.length - 1; i >= 0; i--) {
    if (totalXP >= LEVEL_TIERS[i].totalXP) {
      matched = LEVEL_TIERS[i];
      break;
    }
  }
  return matched;
}

// Rank title corresponding to level
export function getRankTitle(level: number): string {
  const info = getLevelInfo(level);
  return info.title;
}

// Required XP delta to progress from level to level + 1
export function getRequiredXPForLevel(level: number): number {
  const info = getLevelInfo(level);
  return info.requiredXPToNext;
}

// Calculate level progression when new XP is added
export function calculateXPProgression(
  currentLevel: number,
  currentXP: number,
  earnedXP: number,
  _totalXP?: number
): {
  newLevel: number;
  newCurrentXP: number;
  newRequiredXP: number;
  leveledUp: boolean;
  levelsGained: number;
  oldRank: string;
  newRank: string;
  newTierName: string;
  newTierNumber: number;
  newTierLevel: number;
  focus: string;
  unlock: string;
} {
  let level = Math.max(1, currentLevel);
  let xp = currentXP + earnedXP;
  let requiredXP = getRequiredXPForLevel(level);
  let leveledUp = false;
  let levelsGained = 0;
  const oldRank = getRankTitle(currentLevel);

  while (xp >= requiredXP && level < LEVEL_TIERS.length) {
    xp -= requiredXP;
    level += 1;
    leveledUp = true;
    levelsGained += 1;
    requiredXP = getRequiredXPForLevel(level);
  }

  // Handle prestige excess beyond max level (Level 15)
  if (level >= LEVEL_TIERS.length && xp >= requiredXP) {
    xp = requiredXP;
  }

  const info = getLevelInfo(level);

  return {
    newLevel: level,
    newCurrentXP: xp,
    newRequiredXP: requiredXP,
    leveledUp,
    levelsGained,
    oldRank,
    newRank: info.title,
    newTierName: info.tierName,
    newTierNumber: info.tierNumber,
    newTierLevel: info.tierLevel,
    focus: info.focus,
    unlock: info.unlock,
  };
}

export function formatXP(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}
