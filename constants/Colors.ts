export const Colors = {
  primary: '#6C3CE1',
  secondary: '#F1EAFF',
  accent: '#FF6B35',
  background: '#F7F8FE',
  surface: '#FFFFFF',
  surfaceBorder: 'rgba(108, 60, 225, 0.14)',
  textPrimary: '#1E1B2E',
  textMuted: '#7C7894',
  error: '#FF4757',
  success: '#2BBF8A',
  warning: '#FFD93D',
  streak: {
    white: '#FFFFFF',
    orange: '#FF6B35',
    red: '#FF4757',
    blue: '#3B82F6',
    purple: '#6C3CE1',
  },
} as const;

export const Theme = {
  ...Colors,
  text: Colors.textPrimary,
  muted: Colors.textMuted,
  white: '#FFFFFF',
  cardBorderTint: Colors.surfaceBorder,
  radius: {
    card: 16,
    button: 14,
    pill: 999,
    bubbly: 24,
    bubblyButton: 28,
  },
  progressBarHeight: 12,
  progressGlow: 'rgba(255, 107, 53, 0.35)',
} as const;

export function getStreakColor(days: number): string {
  if (days >= 100) return Colors.streak.purple;
  if (days >= 30) return Colors.streak.blue;
  if (days >= 7) return Colors.streak.red;
  if (days >= 1) return Colors.streak.orange;
  return Colors.streak.white;
}

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
