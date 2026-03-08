import React, { useEffect } from 'react';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { getStreakColor } from '@/constants/Colors';

interface StreakFlameProps {
  days: number;
  size?: number;
  animated?: boolean;
}

/**
 * Streak flame SVG icon with milestone color transitions:
 *   Orange (1-6), Red (7-29), Blue (30-99), Purple (100+)
 */
export function StreakFlame({ days, size = 22, animated = true }: StreakFlameProps) {
  const color = getStreakColor(days);
  const pulse = useSharedValue(0);

  useEffect(() => {
    if (!animated || days === 0) return;
    pulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );
  }, [days, animated]);

  const animatedStyle = useAnimatedStyle(() => {
    if (!animated || days === 0) return {};
    return {
      transform: [
        { scale: interpolate(pulse.value, [0, 1], [1, 1.1]) },
      ],
    };
  }, [days, animated]);

  const secondaryColor = getSecondaryFlameColor(days);
  const gradientId = `flameGrad`;

  return (
    <Animated.View style={animatedStyle}>
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Defs>
          <LinearGradient id={gradientId} x1="0" y1="1" x2="0" y2="0">
            <Stop offset="0" stopColor={secondaryColor} />
            <Stop offset="1" stopColor={color} />
          </LinearGradient>
        </Defs>
        {/* Outer flame */}
        <Path
          d="M12 2C12 2 8 6.5 8 10C8 11.5 8.5 13 9.5 14C8.5 12.5 9 10.5 10 9.5C10 9.5 10 13 12 15C14 13 14 9.5 14 9.5C15 10.5 15.5 12.5 14.5 14C15.5 13 16 11.5 16 10C16 6.5 12 2 12 2Z"
          fill={`url(#${gradientId})`}
        />
        {/* Inner glow */}
        <Path
          d="M12 6C12 6 10 9 10 11C10 12.1 10.45 13 11 13.5C10.5 13 10.7 11.5 11.2 11C11.2 11 11.2 13 12 14C12.8 13 12.8 11 12.8 11C13.3 11.5 13.5 13 13 13.5C13.55 13 14 12.1 14 11C14 9 12 6 12 6Z"
          fill={days >= 7 ? '#FFD93D' : '#FFEDD5'}
          opacity={0.85}
        />
      </Svg>
    </Animated.View>
  );
}

function getSecondaryFlameColor(days: number): string {
  if (days >= 100) return '#A78BFA';
  if (days >= 30) return '#60A5FA';
  if (days >= 7) return '#FB923C';
  if (days >= 1) return '#FDE047';
  return '#D1D5DB';
}
