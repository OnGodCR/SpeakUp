import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

const BRAND = {
  primary: '#6C3CE1',
  accent: '#FF6B35',
  dark: '#1A1A2E',
  gray: '#6B7280',
};

type Props = {
  totalSeconds: number;
  onComplete: () => void;
  isPaused?: boolean;
  size?: 'small' | 'large';
};

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export default function Timer({
  totalSeconds,
  onComplete,
  isPaused = false,
  size = 'large',
}: Props) {
  const [remaining, setRemaining] = useState(totalSeconds);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onCompleteRef = useRef(onComplete);
  const remainingRef = useRef(remaining);

  // Keep refs up to date
  onCompleteRef.current = onComplete;
  remainingRef.current = remaining;

  // Reset when totalSeconds changes
  useEffect(() => {
    setRemaining(totalSeconds);
    remainingRef.current = totalSeconds;
  }, [totalSeconds]);

  const tick = useCallback(() => {
    setRemaining((prev) => {
      const next = prev - 1;
      if (next <= 0) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        // Defer the callback to avoid state update during render
        setTimeout(() => onCompleteRef.current(), 0);
        return 0;
      }
      return next;
    });
  }, []);

  useEffect(() => {
    if (isPaused || remaining <= 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(tick, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPaused, remaining <= 0, tick]);

  const isLarge = size === 'large';
  const isLow = remaining <= 10;

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.time,
          {
            fontSize: isLarge ? 56 : 24,
            color: isLow ? BRAND.accent : BRAND.dark,
          },
        ]}
      >
        {formatTime(remaining)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  time: {
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
});
