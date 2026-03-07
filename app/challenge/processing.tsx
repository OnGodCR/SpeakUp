import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';

import Speaky from '../../components/Speaky';
import { useChallengeStore } from '../../stores/challengeStore';
import { Theme } from '../../constants/colors';

export default function ProcessingScreen() {
  const router = useRouter();
  const score = useChallengeStore((s) => s.score);
  const isProcessing = useChallengeStore((s) => s.isProcessing);

  const dotScale = useSharedValue(1);

  useEffect(() => {
    dotScale.value = withRepeat(
      withSequence(
        withTiming(1.4, { duration: 600, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 600, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );
  }, []);

  useEffect(() => {
    if (!isProcessing && score) {
      router.replace('/challenge/score');
    }
  }, [isProcessing, score, router]);

  const dotStyle = useAnimatedStyle(() => ({
    transform: [{ scale: dotScale.value }],
  }));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.loadingContent}>
        <Speaky
          pose="thinking"
          size={170}
          message="Analyzing your speech now. I’m checking clarity, pace, and whether your fillers tried to stage-dive."
        />

        <View style={styles.dotsRow}>
          {[0, 1, 2].map((i) => (
            <Animated.View
              key={i}
              style={[
                styles.dot,
                dotStyle,
                { opacity: 0.4 + i * 0.2, backgroundColor: Theme.accent },
              ]}
            />
          ))}
        </View>

        <Text style={styles.loadingText}>Processing your recording...</Text>
        <Text style={styles.loadingSubtext}>
          Give me a moment. Great feedback takes a second, unlike bad advice.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.background,
  },
  loadingContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 32,
    marginBottom: 24,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Nunito_800ExtraBold',
    color: Theme.text,
    textAlign: 'center',
  },
  loadingSubtext: {
    fontSize: 14,
    color: Theme.muted,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
});
