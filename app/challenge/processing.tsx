import React, { useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
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
import ScoreGauge from '../../components/ScoreGauge';
import ScoreBar from '../../components/ScoreBar';
import { useChallengeStore } from '../../stores/challengeStore';
import { useUserStore } from '../../stores/userStore';
import { getCelebration } from '../../constants/speakyMessages';

const BRAND = {
  primary: '#6C3CE1',
  accent: '#FF6B35',
  dark: '#1A1A2E',
  gray: '#6B7280',
  background: '#F8F9FA',
  white: '#FFFFFF',
};

export default function ProcessingScreen() {
  const router = useRouter();
  const score = useChallengeStore((s) => s.score);
  const isProcessing = useChallengeStore((s) => s.isProcessing);
  const reset = useChallengeStore((s) => s.reset);
  const refreshStats = useUserStore((s) => s.refreshStats);

  // Pulsing dot animation for loading state
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

  const dotStyle = useAnimatedStyle(() => ({
    transform: [{ scale: dotScale.value }],
  }));

  const handleDone = () => {
    refreshStats().catch(() => {});
    reset();
    router.replace('/(tabs)');
  };

  if (isProcessing || !score) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContent}>
          <Speaky message="Analyzing your speech... This usually takes a moment!" mood="thinking" size="large" />

          <View style={styles.dotsRow}>
            {[0, 1, 2].map((i) => (
              <Animated.View
                key={i}
                style={[
                  styles.dot,
                  dotStyle,
                  { opacity: 0.4 + i * 0.2 },
                ]}
              />
            ))}
          </View>

          <Text style={styles.loadingText}>Processing your recording...</Text>
          <Text style={styles.loadingSubtext}>
            Our AI is listening for clarity, pace, structure, and filler words.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.resultContent}>
        <Speaky
          message={getCelebration(score.overall_score)}
          mood={score.overall_score >= 70 ? 'excited' : 'happy'}
          size="large"
        />

        <View style={styles.gaugeContainer}>
          <ScoreGauge score={score.overall_score} size={160} label="Overall" />
        </View>

        <View style={styles.barsContainer}>
          <ScoreBar label="Clarity" score={score.clarity_score} />
          <ScoreBar label="Pace" score={score.pace_score} />
          <ScoreBar label="Structure" score={score.structure_score} />
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{score.words_per_minute}</Text>
            <Text style={styles.statLabel}>WPM</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{score.filler_word_count}</Text>
            <Text style={styles.statLabel}>Filler Words</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>+{score.xp_earned}</Text>
            <Text style={styles.statLabel}>XP Earned</Text>
          </View>
        </View>

        {score.feedback_text ? (
          <View style={styles.feedbackCard}>
            <Text style={styles.feedbackTitle}>Feedback</Text>
            <Text style={styles.feedbackText}>{score.feedback_text}</Text>
          </View>
        ) : null}

        {score.key_improvement ? (
          <View style={styles.improvementCard}>
            <Text style={styles.improvementTitle}>Key Improvement</Text>
            <Text style={styles.improvementText}>{score.key_improvement}</Text>
          </View>
        ) : null}

        <Button
          mode="contained"
          onPress={handleDone}
          style={styles.doneButton}
          labelStyle={styles.doneButtonLabel}
          buttonColor={BRAND.primary}
        >
          Done
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BRAND.background,
  },

  /* Loading state */
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
    backgroundColor: BRAND.primary,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '700',
    color: BRAND.dark,
    textAlign: 'center',
  },
  loadingSubtext: {
    fontSize: 14,
    color: BRAND.gray,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },

  /* Result state */
  resultContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
  },
  gaugeContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  barsContainer: {
    backgroundColor: BRAND.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: BRAND.white,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: BRAND.dark,
  },
  statLabel: {
    fontSize: 11,
    color: BRAND.gray,
    marginTop: 4,
    fontWeight: '500',
  },
  feedbackCard: {
    backgroundColor: BRAND.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  feedbackTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: BRAND.dark,
    marginBottom: 6,
  },
  feedbackText: {
    fontSize: 14,
    color: BRAND.gray,
    lineHeight: 20,
  },
  improvementCard: {
    backgroundColor: '#FFF7ED',
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: BRAND.accent,
  },
  improvementTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: BRAND.accent,
    marginBottom: 6,
  },
  improvementText: {
    fontSize: 14,
    color: BRAND.dark,
    lineHeight: 20,
  },
  doneButton: {
    borderRadius: 28,
    paddingVertical: 4,
    marginTop: 'auto' as any,
  },
  doneButtonLabel: {
    color: BRAND.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
