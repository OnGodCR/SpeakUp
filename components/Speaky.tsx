import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { Theme } from '../constants/colors';

const MOOD_COLORS: Record<string, string> = {
  happy: 'rgba(43, 191, 176, 0.2)',
  thinking: 'rgba(43, 191, 176, 0.15)',
  sad: 'rgba(239, 68, 68, 0.15)',
  excited: 'rgba(255, 107, 53, 0.2)',
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
            borderColor: Theme.accent,
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
  },
  bubble: {
    backgroundColor: Theme.surface,
    borderRadius: Theme.radius.card,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
    maxWidth: 280,
    borderWidth: 1,
    borderColor: Theme.cardBorderTint,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  bubbleText: {
    fontSize: 15,
    color: Theme.text,
    textAlign: 'center',
    lineHeight: 22,
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
    borderTopColor: Theme.surface,
  },
});
