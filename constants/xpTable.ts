/**
 * XP thresholds for each level in SpeakUp.
 * Index corresponds to level (index 0 = level 1).
 */
export const XP_TABLE: number[] = [
  0,      // Level 1
  100,    // Level 2
  200,    // Level 3
  350,    // Level 4
  500,    // Level 5
  700,    // Level 6
  900,    // Level 7
  1100,   // Level 8
  1300,   // Level 9
  1500,   // Level 10
  1800,   // Level 11
  2100,   // Level 12
  2500,   // Level 13
  3000,   // Level 14
  3500,   // Level 15
  4100,   // Level 16
  4700,   // Level 17
  5400,   // Level 18
  5900,   // Level 19
  6500,   // Level 20
  7200,   // Level 21
  8000,   // Level 22
  8800,   // Level 23
  9400,   // Level 24
  10000,  // Level 25
];

export const MAX_LEVEL = XP_TABLE.length;

/**
 * Returns the level for a given amount of total XP.
 * Levels are 1-indexed (minimum level is 1).
 */
export function getLevelForXp(xp: number): number {
  let level = 1;
  for (let i = 1; i < XP_TABLE.length; i++) {
    if (xp >= XP_TABLE[i]) {
      level = i + 1;
    } else {
      break;
    }
  }
  return level;
}

/**
 * Returns the total XP required to reach a given level.
 * Levels are 1-indexed.
 */
export function getXpForLevel(level: number): number {
  const index = Math.max(0, Math.min(level - 1, XP_TABLE.length - 1));
  return XP_TABLE[index];
}

/**
 * Returns detailed progress information for a given amount of total XP.
 */
export function getXpProgress(xp: number): {
  level: number;
  currentXp: number;
  nextLevelXp: number;
  progress: number;
} {
  const level = getLevelForXp(xp);
  const currentLevelThreshold = getXpForLevel(level);
  const isMaxLevel = level >= MAX_LEVEL;
  const nextLevelThreshold = isMaxLevel
    ? currentLevelThreshold
    : getXpForLevel(level + 1);

  const currentXp = xp - currentLevelThreshold;
  const nextLevelXp = nextLevelThreshold - currentLevelThreshold;
  const progress = isMaxLevel ? 1 : nextLevelXp > 0 ? currentXp / nextLevelXp : 1;

  return {
    level,
    currentXp,
    nextLevelXp,
    progress: Math.min(Math.max(progress, 0), 1),
  };
}
