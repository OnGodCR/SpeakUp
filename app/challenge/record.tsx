import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import Timer from '../../components/Timer';
import { useChallengeStore } from '../../stores/challengeStore';
import { setupRecording, stopRecording } from '../../lib/audio';

const COLORS = {
  primary: '#6C3CE1',
  accent: '#FF6B35',
  dark: '#1A1A2E',
  gray: '#6B7280',
  white: '#FFFFFF',
};

const RECORD_SECONDS = 300; // 5 minutes
const MIN_RECORD_SECONDS = 60; // minimum before "Stop Early" is enabled
const HAPTIC_AT_REMAINING = [60, 10]; // trigger haptic at 1:00 and 0:10 remaining
const NUM_BARS = 20;

export default function RecordScreen() {
  const router = useRouter();
  const challenge = useChallengeStore((s) => s.challenge);
  const submitSpeech = useChallengeStore((s) => s.submitSpeech);

  const recordingRef = useRef<Audio.Recording | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [isStopping, setIsStopping] = useState(false);
  const elapsedRef = useRef(0);
  const hapticFiredRef = useRef(new Set<number>());

  // Waveform bar heights
  const [barHeights, setBarHeights] = useState<number[]>(
    () => Array.from({ length: NUM_BARS }, () => Math.random() * 0.6 + 0.2),
  );

  // Pulsing red circle animation
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0.6);

  useEffect(() => {
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.3, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );
    pulseOpacity.value = withRepeat(
      withSequence(
        withTiming(0.3, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.6, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));

  // Track elapsed time for "Stop Early" button
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + 1;
        elapsedRef.current = next;
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Animate waveform bars
  useEffect(() => {
    const interval = setInterval(() => {
      setBarHeights(
        Array.from({ length: NUM_BARS }, () => Math.random() * 0.7 + 0.15),
      );
    }, 150);
    return () => clearInterval(interval);
  }, []);

  // Haptic feedback at specific remaining-time thresholds
  useEffect(() => {
    const remaining = RECORD_SECONDS - elapsed;
    for (const threshold of HAPTIC_AT_REMAINING) {
      if (remaining === threshold && !hapticFiredRef.current.has(threshold)) {
        hapticFiredRef.current.add(threshold);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }
    }
  }, [elapsed]);

  // Start recording on mount
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const recording = await setupRecording();
        if (mounted) {
          recordingRef.current = recording;
        }
      } catch (err) {
        console.error('Failed to start recording:', err);
      }
    })();

    return () => {
      mounted = false;
      // Cleanup: stop recording if still active when unmounting
      if (recordingRef.current) {
        recordingRef.current.stopAndUnloadAsync().catch(() => {});
      }
    };
  }, []);

  const handleStop = useCallback(async () => {
    if (isStopping || !recordingRef.current) return;
    setIsStopping(true);

    try {
      const { uri, duration } = await stopRecording(recordingRef.current);
      recordingRef.current = null;

      // Navigate first, then submit in background
      router.push('/challenge/processing');
      submitSpeech(uri, duration);
    } catch (err) {
      console.error('Failed to stop recording:', err);
      setIsStopping(false);
    }
  }, [isStopping, router, submitSpeech]);

  const handleTimerComplete = useCallback(() => {
    handleStop();
  }, [handleStop]);

  const canStopEarly = elapsed >= MIN_RECORD_SECONDS;

  return (
    <SafeAreaView style={styles.container}>
      {/* Topic reference */}
      <View style={styles.topicContainer}>
        <Text style={styles.topicText} numberOfLines={2}>
          {challenge?.topic ?? ''}
        </Text>
      </View>

      {/* Recording indicator */}
      <View style={styles.indicatorContainer}>
        <View style={styles.indicatorWrapper}>
          <Animated.View style={[styles.pulseRing, pulseStyle]} />
          <View style={styles.recordDot} />
        </View>
        <Text style={styles.recordingLabel}>Recording</Text>
      </View>

      {/* Timer */}
      <View style={styles.timerContainer}>
        <Timer
          totalSeconds={RECORD_SECONDS}
          onComplete={handleTimerComplete}
          size="large"
        />
      </View>

      {/* Waveform */}
      <View style={styles.waveformContainer}>
        {barHeights.map((height, index) => (
          <View
            key={index}
            style={[
              styles.waveBar,
              {
                height: height * 60,
                backgroundColor:
                  height > 0.6 ? COLORS.accent : COLORS.primary,
              },
            ]}
          />
        ))}
      </View>

      {/* Stop button */}
      <View style={styles.buttonContainer}>
        <Button
          mode="outlined"
          onPress={handleStop}
          disabled={!canStopEarly || isStopping}
          textColor={canStopEarly ? COLORS.white : COLORS.gray}
          style={[
            styles.stopButton,
            !canStopEarly && styles.stopButtonDisabled,
          ]}
          labelStyle={styles.buttonLabel}
        >
          {isStopping ? 'Stopping...' : 'Stop Early'}
        </Button>
        {!canStopEarly ? (
          <Text style={styles.minTimeHint}>
            Minimum {MIN_RECORD_SECONDS}s before stopping
          </Text>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.dark,
    paddingHorizontal: 24,
  },
  topicContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  topicText: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 22,
  },
  indicatorContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  indicatorWrapper: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pulseRing: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EF4444',
  },
  recordDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EF4444',
  },
  recordingLabel: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '600',
    color: '#EF4444',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  timerContainer: {
    alignItems: 'center',
    marginTop: 32,
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
    marginTop: 40,
    gap: 3,
  },
  waveBar: {
    width: 4,
    borderRadius: 2,
    minHeight: 4,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 24,
  },
  stopButton: {
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 12,
    minWidth: 200,
  },
  stopButtonDisabled: {
    borderColor: 'rgba(255,255,255,0.1)',
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
    paddingVertical: 4,
  },
  minTimeHint: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 8,
  },
});
