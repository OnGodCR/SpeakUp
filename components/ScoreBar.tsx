import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const BRAND = {
  primary: '#6C3CE1',
  dark: '#1A1A2E',
  gray: '#6B7280',
};

function getScoreColor(score: number): string {
  if (score < 50) return '#EF4444';
  if (score < 70) return '#F97316';
  if (score < 80) return '#EAB308';
  if (score < 90) return '#22C55E';
  return BRAND.primary;
}

type Props = {
  label: string;
  score: number;
  animated?: boolean;
};

export default function ScoreBar({ label, score, animated = true }: Props) {
  const width = useSharedValue(animated ? 0 : score);

  useEffect(() => {
    if (animated) {
      width.value = 0;
      width.value = withTiming(score, {
        duration: 900,
        easing: Easing.out(Easing.cubic),
      });
    } else {
      width.value = score;
    }
  }, [score, animated]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${width.value}%`,
  }));

  const color = getScoreColor(score);

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.scoreText, { color }]}>{score}</Text>
      </View>
      <View style={styles.track}>
        <Animated.View
          style={[styles.fill, fillStyle, { backgroundColor: color }]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    color: BRAND.dark,
    fontWeight: '500',
  },
  scoreText: {
    fontSize: 14,
    fontWeight: '700',
  },
  track: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
});
