import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { Theme } from '../constants/colors';

/** Streak flame color: white (0), orange (1–6), red (7–29), blue (30–99), purple (100+) */
function getStreakColor(streak: number): string {
  if (streak <= 0) return Theme.streak.none;
  if (streak < 7) return Theme.streak.low;
  if (streak < 30) return Theme.streak.medium;
  if (streak < 100) return Theme.streak.high;
  return Theme.streak.legendary;
}

type Props = {
  streak: number;
  size?: 'small' | 'large';
};

export default function StreakBadge({ streak, size = 'small' }: Props) {
  const color = getStreakColor(streak);
  const isLarge = size === 'large';
  const emojiSize = isLarge ? 32 : 18;
  const countSize = isLarge ? 24 : 14;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={{ fontSize: emojiSize }}>🔥</Text>
        <Text
          style={[
            styles.count,
            { fontSize: countSize, color },
          ]}
        >
          {streak}
        </Text>
      </View>
      {isLarge ? (
        <Text style={[styles.dayLabel, { color }]}>Day {streak}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  count: {
    fontWeight: '700',
  },
  dayLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
});
