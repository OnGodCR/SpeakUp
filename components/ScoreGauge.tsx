import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Theme } from '../constants/Colors';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

function getScoreColor(score: number): string {
  if (score < 50) return '#EF4444';
  if (score < 70) return Theme.primary;
  if (score < 80) return '#EAB308';
  if (score < 90) return '#22C55E';
  return Theme.accent;
}

type Props = {
  score: number;
  size?: number;
  label?: string;
};

const GAUGE_DURATION = 1200;

export default function ScoreGauge({ score, size = 160, label }: Props) {
  const strokeWidth = Theme.progressBarHeight + 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  const animatedScore = useSharedValue(0);
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    animatedScore.value = 0;
    setDisplayScore(0);
    animatedScore.value = withTiming(score, {
      duration: GAUGE_DURATION,
      easing: Easing.out(Easing.cubic),
    });
    const start = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const t = Math.min(1, elapsed / GAUGE_DURATION);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplayScore(Math.round(score * eased));
    }, 40);
    const done = setTimeout(() => setDisplayScore(score), GAUGE_DURATION + 50);
    return () => {
      clearInterval(timer);
      clearTimeout(done);
    };
  }, [score]);

  const animatedProps = useAnimatedProps(() => {
    const progress = animatedScore.value / 100;
    return {
      strokeDashoffset: circumference * (1 - progress),
    };
  });

  const color = getScoreColor(score);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={Theme.surface}
          strokeWidth={strokeWidth}
          fill="none"
        />
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
        <Text style={[styles.scoreText, { fontSize: size * 0.28, color }]}>
          {displayScore}
        </Text>
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
    fontFamily: 'Nunito_800ExtraBold',
  },
  label: {
    color: Theme.muted,
    marginTop: 2,
    fontWeight: '600',
  },
});
