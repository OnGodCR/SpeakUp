/**
 * SpeakUp brand palette -- gamified + friendly
 * Primary #6C3CE1 (purple), Accent #FF6B35 (orange)
 * Deep Navy #1A1A2E for trust, Teal #0D9488 for growth
 */
export const Colors = {
  primary: '#6C3CE1',
  primaryLight: '#8B5CF6',
  primaryDark: '#5B2BC7',
  secondary: '#F1EAFF',
  accent: '#FF6B35',
  accentLight: '#FF8F66',
  deepNavy: '#1A1A2E',
  teal: '#0D9488',
  tealLight: '#14B8A6',
  background: '#F7F8FE',
  surface: '#FFFFFF',
  text: '#1E1B2E',
  muted: '#7C7894',
  white: '#FFFFFF',
  success: '#2BBF8A',
  error: '#EF4444',
  warning: '#F59E0B',
  streak: {
    none: '#C0C0C0',
    low: '#FF6B35',
    medium: '#FF4757',
    high: '#3B82F6',
    legendary: '#6C3CE1',
  },
};

/** Card border / shadow tint */
export const cardBorderTint = 'rgba(108, 60, 225, 0.14)';

/** Design tokens */
export const Theme = {
  ...Colors,
  cardBorderTint,
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
