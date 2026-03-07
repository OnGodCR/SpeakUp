import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { getStreakColor } from '@/constants/Colors';

interface StreakFlameProps {
  days: number;
  size?: number;
}

export function StreakFlame({ days, size = 22 }: StreakFlameProps) {
  return (
    <Text style={[styles.flame, { fontSize: size, color: getStreakColor(days) }]}>
      {'\u{1F525}'}
    </Text>
  );
}

const styles = StyleSheet.create({
  flame: {},
});
