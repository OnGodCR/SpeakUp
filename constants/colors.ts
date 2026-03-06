/**
 * SpeakUp brand palette — Duolingo-inspired design language
 * Primary #FF6B35 (orange), Secondary #1A2744 (deep navy), Accent #2BBFB0 (teal)
 */
export const Colors = {
  primary: '#FF6B35',
  secondary: '#1A2744',
  accent: '#2BBFB0',
  background: '#0F1624',
  surface: '#1E2A3B',
  text: '#FFFFFF',
  muted: '#8899AA',
  white: '#FFFFFF',
  success: '#2BBFB0',
  error: '#EF4444',
  warning: '#F59E0B',
  streak: {
    none: '#FFFFFF',
    low: '#FF6B35',
    medium: '#EF4444',
    high: '#3B82F6',
    legendary: '#8B5CF6',
  },
};

/** Card border / shadow tint (accent at 10% opacity) */
export const cardBorderTint = 'rgba(43, 191, 176, 0.1)';

/** Design tokens */
export const Theme = {
  ...Colors,
  cardBorderTint,
  radius: {
    card: 16,
    button: 14,
    pill: 999,
  },
  progressBarHeight: 12,
  /** Glow for progress fill (e.g. shadow) */
  progressGlow: 'rgba(43, 191, 176, 0.4)',
} as const;
