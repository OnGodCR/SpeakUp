/**
 * Contextual messages for Speaky, the SpeakUp mascot.
 * Speaky is a supportive coach with a slightly witty personality.
 */

export const greetings = {
  /** User has no active streak */
  noStreak: [
    "Hey there! Ready to find your voice today?",
    "Welcome back! A fresh start is just one challenge away.",
    "No streak yet? No worries -- today is day one!",
    "Great to see you! Let's turn that zero into a hero streak.",
  ],
  /** Streak of 1-6 days */
  shortStreak: [
    "You're building momentum! Keep that streak alive!",
    "Look at you showing up! Consistency is the secret sauce.",
    "Another day, another chance to level up your speaking game!",
    "Your streak is growing -- don't stop now!",
  ],
  /** Streak of 7-29 days */
  mediumStreak: [
    "Wow, over a week strong! You're turning into a speaking machine!",
    "Your streak is seriously impressive. Keep crushing it!",
    "Double digits incoming! You're on fire!",
    "At this rate, stages everywhere should be nervous.",
  ],
  /** Streak of 30+ days */
  longStreak: [
    "A month-long streak?! You're absolutely legendary!",
    "I bow to your dedication. You are a speaking force of nature!",
    "Over 30 days! At this point, YOU should be coaching ME.",
    "Streak royalty has entered the building. All hail!",
  ],
};

export const encouragement = [
  "Your daily challenge is waiting -- you've got this!",
  "A quick practice session can make all the difference. Jump in!",
  "The best speakers practice every day. Your turn!",
  "Don't let today slip by! Your future self will thank you.",
  "Just a few minutes of practice. That's all it takes!",
  "Your streak is counting on you -- let's go!",
  "Speak up! Literally. Your challenge is ready.",
  "The mic is warm and the stage is set. Time to shine!",
];

export const celebration = {
  /** Score below 50 */
  needsWork: [
    "Hey, you showed up -- and that's what counts! Try again to boost your score.",
    "Every great speaker started somewhere. Keep practicing!",
    "Rome wasn't built in a day, and neither is a TED talk. You'll get there!",
    "The hardest part is showing up, and you did that. Onward!",
  ],
  /** Score 50-69 */
  decent: [
    "Solid effort! A little more practice and you'll be soaring.",
    "Not bad at all! You're getting the hang of this.",
    "You're on the right track -- keep pushing!",
    "Good work! Every session makes you a bit sharper.",
  ],
  /** Score 70-79 */
  good: [
    "Nice job! You're really finding your groove!",
    "That was great! Your confidence is showing.",
    "Look at those skills! You're leveling up for real.",
    "Impressive work! Keep this energy going!",
  ],
  /** Score 80-89 */
  great: [
    "Wow, that was fantastic! You're a natural!",
    "Crushing it! Your speaking skills are seriously on point.",
    "Almost perfect! You should be proud of that one.",
    "Top-tier performance! The audience would be hooked.",
  ],
  /** Score 90+ */
  outstanding: [
    "INCREDIBLE! That was absolutely world-class!",
    "Standing ovation! You nailed it!",
    "Perfection! I'm running out of compliments here!",
    "Are you sure you need me? That was flawless!",
    "Mic drop moment! You're officially a speaking legend!",
  ],
};

export const streakBreak = [
  "Your streak ended, but your journey hasn't. Let's start a new one!",
  "Streaks break -- it happens to the best of us. What matters is coming back.",
  "Don't sweat it! A new streak starts with a single challenge.",
  "The comeback is always stronger than the setback. Let's go!",
];

export const streakShield = [
  "Streak shield activated! Your streak lives to fight another day.",
  "Close call! Good thing you had a shield. Your streak is safe!",
  "Shield deployed! Your streak is protected. Use today wisely!",
];

export const levelUp = [
  "You just hit Level {level}! The world better watch out!",
  "LEVEL UP! Welcome to Level {level} -- new heights unlocked!",
  "Level {level} achieved! You're climbing the ranks like a pro!",
  "Ding! Level {level}! Your speaking journey keeps getting better!",
];

/**
 * Picks a random message from an array.
 */
export function pickRandom(messages: string[]): string {
  return messages[Math.floor(Math.random() * messages.length)];
}

/**
 * Returns an appropriate greeting based on streak length.
 */
export function getGreeting(streakDays: number): string {
  if (streakDays <= 0) return pickRandom(greetings.noStreak);
  if (streakDays <= 6) return pickRandom(greetings.shortStreak);
  if (streakDays <= 29) return pickRandom(greetings.mediumStreak);
  return pickRandom(greetings.longStreak);
}

/**
 * Returns an appropriate celebration message based on challenge score.
 */
export function getCelebration(score: number): string {
  if (score < 50) return pickRandom(celebration.needsWork);
  if (score < 70) return pickRandom(celebration.decent);
  if (score < 80) return pickRandom(celebration.good);
  if (score < 90) return pickRandom(celebration.great);
  return pickRandom(celebration.outstanding);
}

/**
 * Returns a level-up message with the level number inserted.
 */
export function getLevelUpMessage(level: number): string {
  const template = pickRandom(levelUp);
  return template.replace('{level}', String(level));
}
