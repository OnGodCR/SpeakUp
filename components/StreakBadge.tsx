import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

function getStreakColor(streak: number): string {
  if (streak <= 0) return '#9CA3AF';   // gray
  if (streak < 7) return '#FF6B35';    // orange
  if (streak < 30) return '#EF4444';   // red
  if (streak < 100) return '#3B82F6';  // blue
  return '#6C3CE1';                    // purple
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
