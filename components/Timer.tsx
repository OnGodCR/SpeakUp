import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { Theme } from '../constants/colors';

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

  onCompleteRef.current = onComplete;
  remainingRef.current = remaining;

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
            color: isLow ? Theme.primary : Theme.text,
            fontFamily: 'Nunito_800ExtraBold',
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
    fontVariant: ['tabular-nums'],
  },
});
