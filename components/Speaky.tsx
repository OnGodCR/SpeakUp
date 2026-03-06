import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

const BRAND = {
  primary: '#6C3CE1',
  accent: '#FF6B35',
  dark: '#1A1A2E',
  gray: '#6B7280',
};

const MOOD_COLORS: Record<string, string> = {
  happy: '#E8D5FF',
  thinking: '#D5E8FF',
  sad: '#FFD5D5',
  excited: '#FFE0CC',
};

type Props = {
  message?: string;
  mood?: 'happy' | 'thinking' | 'sad' | 'excited';
  size?: 'small' | 'large';
};

export default function Speaky({ message, mood = 'happy', size = 'large' }: Props) {
  const circleSize = size === 'large' ? 120 : 64;
  const emojiSize = size === 'large' ? 48 : 24;
  const bgColor = MOOD_COLORS[mood] ?? MOOD_COLORS.happy;

  return (
    <View style={styles.container}>
      {message ? (
        <View style={styles.bubble}>
          <Text style={styles.bubbleText}>{message}</Text>
          <View style={styles.bubbleTail} />
        </View>
      ) : null}

      <View
        style={[
          styles.circle,
          {
            width: circleSize,
            height: circleSize,
            borderRadius: circleSize / 2,
            backgroundColor: bgColor,
          },
        ]}
      >
        <Text style={{ fontSize: emojiSize }}>🎤</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  circle: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: BRAND.primary,
  },
  bubble: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 12,
    maxWidth: 240,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  bubbleText: {
    fontSize: 14,
    color: BRAND.dark,
    textAlign: 'center',
    lineHeight: 20,
  },
  bubbleTail: {
    position: 'absolute',
    bottom: -8,
    alignSelf: 'center',
    left: '50%',
    marginLeft: -8,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#FFFFFF',
  },
});
