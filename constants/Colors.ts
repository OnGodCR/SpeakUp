export const Colors = {
  primary: '#FF6B35',
  secondary: '#1A2744',
  accent: '#2BBFB0',
  background: '#0F1624',
  surface: '#1E2A3B',
  surfaceBorder: 'rgba(43, 191, 176, 0.10)',
  textPrimary: '#FFFFFF',
  textMuted: '#8899AA',
  error: '#FF4757',
  success: '#2BBFB0',
  warning: '#FFD93D',

  // Streak flame colors by length
  streak: {
    white: '#FFFFFF',    // 0 days
    orange: '#FF6B35',   // 1-6 days
    red: '#FF4757',      // 7-29 days
    blue: '#3B82F6',     // 30-99 days
    purple: '#8B5CF6',   // 100+ days
  },
} as const;

export function getStreakColor(days: number): string {
  if (days >= 100) return Colors.streak.purple;
  if (days >= 30) return Colors.streak.blue;
  if (days >= 7) return Colors.streak.red;
  if (days >= 1) return Colors.streak.orange;
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
