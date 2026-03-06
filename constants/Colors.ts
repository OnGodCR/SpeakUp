export const Colors = {
  primary: '#FF6B35',
  secondary: '#1A2744',
  accent: '#2BBFB0',
  background: '#0F1624',
  surface: '#1E2A3B',
  textPrimary: '#FFFFFF',
  textMuted: '#8899AA',
  error: '#FF4757',
  success: '#2BBFB0',
  warning: '#FFD93D',

  // Streak flame colors by length
  streak: {
    white: '#FFFFFF',    // 1-3 days
    orange: '#FF6B35',   // 4-7 days
    red: '#FF4757',      // 8-14 days
    blue: '#3B82F6',     // 15-29 days
    purple: '#8B5CF6',   // 30+ days
  },
} as const;

export function getStreakColor(days: number): string {
  if (days >= 30) return Colors.streak.purple;
  if (days >= 15) return Colors.streak.blue;
  if (days >= 8) return Colors.streak.red;
  if (days >= 4) return Colors.streak.orange;
  return Colors.streak.white;
}

// For legacy compatibility with template imports
export default {
  light: {
    text: Colors.textPrimary,
    background: Colors.background,
    tint: Colors.primary,
    tabIconDefault: Colors.textMuted,
    tabIconSelected: Colors.primary,
  },
  dark: {
    text: Colors.textPrimary,
    background: Colors.background,
    tint: Colors.primary,
    tabIconDefault: Colors.textMuted,
    tabIconSelected: Colors.primary,
  },
};
