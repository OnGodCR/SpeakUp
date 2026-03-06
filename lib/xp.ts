// ---------------------------------------------------------------------------
// XP calculation logic
// ---------------------------------------------------------------------------

const BASE_XP = 50;

/**
 * Calculate the XP earned for a single speech submission.
 *
 * Breakdown:
 *  - Base:            50 XP (always)
 *  - Score > 90:     +35 bonus
 *  - Score > 80:     +20 bonus  (mutually exclusive with the 90 tier)
 *  - Score > 70:     +10 bonus  (mutually exclusive with the 80/90 tiers)
 *  - Personal best:  +30 bonus  (stacks on top of any score bonus)
 */
export function calculateXpEarned(
  score: number,
  isPersonalBest: boolean,
): number {
  let xp = BASE_XP;

  if (score > 90) {
    xp += 35;
  } else if (score > 80) {
    xp += 20;
  } else if (score > 70) {
    xp += 10;
  }

  if (isPersonalBest) {
    xp += 30;
  }

  return xp;
}

// ---------------------------------------------------------------------------
// Streak milestone rewards
// ---------------------------------------------------------------------------

const STREAK_MILESTONES: Record<number, number> = {
  3: 25,
  7: 75,
  14: 150,
  30: 500,
};

/**
 * Return the bonus XP for reaching a streak milestone.
 *
 * @returns The milestone XP reward, or 0 if the given day count is not a milestone.
 */
export function getStreakMilestoneXp(streakDays: number): number {
  return STREAK_MILESTONES[streakDays] ?? 0;
}
