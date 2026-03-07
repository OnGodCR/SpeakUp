import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '@/constants/Colors';
import { BorderRadius, FontSize, FontWeight, Spacing } from '@/constants/theme';

interface BadgeProps {
  children: React.ReactNode;
  color?: string;
  bgColor?: string;
  style?: ViewStyle;
}

export function Badge({ children, color, bgColor, style }: BadgeProps) {
  return (
    <View
      style={[
        styles.badge,
        bgColor ? { backgroundColor: bgColor } : undefined,
        style,
      ]}
    >
      {typeof children === 'string' ? (
        <Text style={[styles.text, color ? { color } : undefined]}>
          {children}
        </Text>
      ) : (
        children
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  text: {
    color: Colors.textPrimary,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
  },
});
