import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  useDerivedValue,
  Easing,
} from 'react-native-reanimated';

const BRAND = {
  primary: '#6C3CE1',
  dark: '#1A1A2E',
};

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

function getScoreColor(score: number): string {
  if (score < 50) return '#EF4444';
  if (score < 70) return '#F97316';
  if (score < 80) return '#EAB308';
  if (score < 90) return '#22C55E';
  return BRAND.primary;
}

type Props = {
  score: number;
  size?: number;
  label?: string;
};

export default function ScoreGauge({ score, size = 160, label }: Props) {
  const strokeWidth = size * 0.08;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  const animatedScore = useSharedValue(0);

  useEffect(() => {
    animatedScore.value = 0;
    animatedScore.value = withTiming(score, {
      duration: 1200,
      easing: Easing.out(Easing.cubic),
    });
  }, [score]);

  const animatedProps = useAnimatedProps(() => {
    const progress = animatedScore.value / 100;
    return {
      strokeDashoffset: circumference * (1 - progress),
    };
  });

  const displayScore = useDerivedValue(() => {
    return Math.round(animatedScore.value);
  });

  const color = getScoreColor(score);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        {/* Background circle */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress arc */}
        <AnimatedCircle
          cx={center}
          cy={center}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          strokeLinecap="round"
          transform={`rotate(-90 ${center} ${center})`}
        />
      </Svg>

      <View style={styles.centerContent}>
        <Animated.Text
          style={[
            styles.scoreText,
            { fontSize: size * 0.28, color },
          ]}
        >
          {/* Static display – reanimated text requires a worklet-aware text component;
              fall back to the target value for simplicity. */}
          {score}
        </Animated.Text>
        {label ? (
          <Text style={[styles.label, { fontSize: size * 0.09 }]}>{label}</Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContent: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreText: {
    fontWeight: '800',
  },
  label: {
    color: '#6B7280',
    marginTop: 2,
  },
});
