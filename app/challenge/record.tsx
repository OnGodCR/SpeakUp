import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, StyleSheet, Vibration } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Audio } from 'expo-av';
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
import { Theme } from '../../constants/Colors';

const RECORD_SECONDS = 300;
const MIN_RECORD_SECONDS = 60;
const HAPTIC_AT_REMAINING = [60, 10];
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

  const [barHeights, setBarHeights] = useState<number[]>(
    () => Array.from({ length: NUM_BARS }, () => Math.random() * 0.6 + 0.2),
  );

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

  useEffect(() => {
    const interval = setInterval(() => {
      setBarHeights(
        Array.from({ length: NUM_BARS }, () => Math.random() * 0.7 + 0.15),
      );
    }, 150);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const remaining = RECORD_SECONDS - elapsed;
    for (const threshold of HAPTIC_AT_REMAINING) {
      if (remaining === threshold && !hapticFiredRef.current.has(threshold)) {
        hapticFiredRef.current.add(threshold);
        Vibration.vibrate(80);
      }
    }
  }, [elapsed]);

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
      <View style={styles.topicContainer}>
        <Text style={styles.topicText} numberOfLines={2}>
          {challenge?.topic ?? ''}
        </Text>
      </View>

      <View style={styles.indicatorContainer}>
        <View style={styles.indicatorWrapper}>
          <Animated.View style={[styles.pulseRing, pulseStyle]} />
          <View style={styles.recordDot} />
        </View>
        <Text style={styles.recordingLabel}>Recording</Text>
      </View>

      <View style={styles.timerContainer}>
        <Timer
          totalSeconds={RECORD_SECONDS}
          onComplete={handleTimerComplete}
          size="large"
        />
      </View>

      <View style={styles.waveformContainer}>
        {barHeights.map((height, index) => (
          <View
            key={index}
            style={[
              styles.waveBar,
              {
                height: height * 60,
                backgroundColor: Theme.accent,
              },
            ]}
          />
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <Button
          mode="outlined"
          onPress={handleStop}
          disabled={!canStopEarly || isStopping}
          textColor={canStopEarly ? Theme.text : Theme.muted}
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
    backgroundColor: Theme.background,
    paddingHorizontal: 24,
  },
  topicContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  topicText: {
    fontSize: 16,
    color: Theme.muted,
    textAlign: 'center',
    lineHeight: 22,
  },
  indicatorContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  indicatorWrapper: {
    width: 88,
    height: 88,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pulseRing: {
    position: 'absolute',
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Theme.accent,
  },
  recordDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Theme.accent,
  },
  recordingLabel: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '700',
    color: Theme.primary,
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
    gap: 4,
  },
  waveBar: {
    width: 5,
    borderRadius: 3,
    minHeight: 4,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 24,
  },
  stopButton: {
    borderColor: Theme.muted,
    borderRadius: Theme.radius.button,
    minWidth: 200,
    paddingVertical: 8,
  },
  stopButtonDisabled: {
    borderColor: Theme.muted + '60',
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '700',
    paddingVertical: 4,
  },
  minTimeHint: {
    fontSize: 12,
    color: Theme.muted,
    marginTop: 8,
  },
});
