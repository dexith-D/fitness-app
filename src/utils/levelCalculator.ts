// Rank titles corresponding to level tiers
export function getRankTitle(level: number): string {
  if (level < 10) return 'Novice Explorer';
  if (level < 20) return 'Bronze Guardian';
  if (level === 24) return 'Iron Vanguard I';
  if (level === 25) return 'Iron Vanguard II';
  if (level < 30) return 'Iron Vanguard III';
  if (level < 40) return 'Diamond Champion';
  if (level < 50) return 'Obsidian Master';
  return 'Aether Titan';
}

// Target XP needed for a specific level
export function getRequiredXPForLevel(level: number): number {
  if (level <= 1) return 1000;
  // Level 24 has 4,000 XP runway as per Stitch designs
  if (level === 24) return 4000;
  if (level === 25) return 4500;
  return Math.round(1000 + (level - 1) * 150);
}

// Calculate level progression when new XP is added
export function calculateXPProgression(
  currentLevel: number,
  currentXP: number,
  earnedXP: number
): {
  newLevel: number;
  newCurrentXP: number;
  newRequiredXP: number;
  leveledUp: boolean;
  levelsGained: number;
  oldRank: string;
  newRank: string;
} {
  let level = currentLevel;
  let xp = currentXP + earnedXP;
  let requiredXP = getRequiredXPForLevel(level);
  let leveledUp = false;
  let levelsGained = 0;
  const oldRank = getRankTitle(currentLevel);

  while (xp >= requiredXP) {
    xp -= requiredXP;
    level += 1;
    leveledUp = true;
    levelsGained += 1;
    requiredXP = getRequiredXPForLevel(level);
  }

  const newRank = getRankTitle(level);

  return {
    newLevel: level,
    newCurrentXP: xp,
    newRequiredXP: requiredXP,
    leveledUp,
    levelsGained,
    oldRank,
    newRank,
  };
}

export function formatXP(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}
