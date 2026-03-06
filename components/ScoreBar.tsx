import React, { useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Text } from 'react-native-paper';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Theme } from '../constants/colors';

function getScoreColor(score: number): string {
  if (score < 50) return '#EF4444';
  if (score < 70) return Theme.primary;
  if (score < 80) return '#EAB308';
  if (score < 90) return '#22C55E';
  return Theme.accent;
}

type Props = {
  label: string;
  score: number;
  animated?: boolean;
};

const BAR_HEIGHT = Theme.progressBarHeight;

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
          style={[
            styles.fill,
            fillStyle,
            {
              backgroundColor: color,
              shadowColor: color,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.6,
              shadowRadius: 4,
              elevation: 4,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    color: Theme.text,
    fontWeight: '600',
  },
  scoreText: {
    fontSize: 14,
    fontWeight: '700',
  },
  track: {
    height: BAR_HEIGHT,
    borderRadius: BAR_HEIGHT / 2,
    backgroundColor: Theme.surface,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: BAR_HEIGHT / 2,
  },
});
