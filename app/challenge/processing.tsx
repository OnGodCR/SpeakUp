import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
  withSpring,
  Easing,
} from 'react-native-reanimated';

import Speaky from '../../components/Speaky';
import ScoreGauge from '../../components/ScoreGauge';
import ScoreBar from '../../components/ScoreBar';
import { useChallengeStore } from '../../stores/challengeStore';
import { useUserStore } from '../../stores/userStore';
import { getCelebration } from '../../constants/speakyMessages';
import { Theme } from '../../constants/colors';

export default function ProcessingScreen() {
  const router = useRouter();
  const score = useChallengeStore((s) => s.score);
  const isProcessing = useChallengeStore((s) => s.isProcessing);
  const reset = useChallengeStore((s) => s.reset);
  const refreshStats = useUserStore((s) => s.refreshStats);

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

  const resultOpacity = useSharedValue(0);
  const resultScale = useSharedValue(0.9);
  useEffect(() => {
    if (score) {
      resultOpacity.value = withDelay(200, withTiming(1, { duration: 400 }));
      resultScale.value = withDelay(200, withSpring(1, { damping: 14 }));
    }
  }, [!!score]);

  const resultAnimatedStyle = useAnimatedStyle(() => ({
    opacity: resultOpacity.value,
    transform: [{ scale: resultScale.value }],
  }));

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
                  { opacity: 0.4 + i * 0.2, backgroundColor: Theme.accent },
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
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.resultContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={resultAnimatedStyle}>
        <View style={styles.gaugeContainer}>
          <ScoreGauge score={score.overall_score} size={160} label="Overall" />
        </View>

        <View style={styles.barsCard}>
          <ScoreBar label="Clarity" score={score.clarity_score} />
          <ScoreBar label="Pace" score={score.pace_score} />
          <ScoreBar label="Structure" score={score.structure_score} />
        </View>

        <View style={styles.speakyFeedbackCard}>
          <Speaky
            message={getCelebration(score.overall_score)}
            mood={score.overall_score >= 70 ? 'excited' : 'happy'}
            size="large"
          />
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{score.words_per_minute}</Text>
            <Text style={styles.statLabel}>WPM</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{score.filler_word_count}</Text>
            <Text style={styles.statLabel}>Filler</Text>
          </View>
          <View style={styles.xpPill}>
            <Text style={styles.xpPillText}>+{score.xp_earned} XP</Text>
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
          buttonColor={Theme.primary}
        >
          Done
        </Button>
        </Animated.View>
      </ScrollView>
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

  scroll: {
    flex: 1,
  },
  resultContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
  },
  gaugeContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  barsCard: {
    backgroundColor: Theme.surface,
    borderRadius: Theme.radius.card,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Theme.cardBorderTint,
  },
  speakyFeedbackCard: {
    alignItems: 'center',
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: Theme.surface,
    borderRadius: Theme.radius.card,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Theme.cardBorderTint,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: Theme.text,
    fontFamily: 'Nunito_800ExtraBold',
  },
  statLabel: {
    fontSize: 11,
    color: Theme.muted,
    marginTop: 4,
    fontWeight: '600',
  },
  xpPill: {
    backgroundColor: Theme.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: Theme.radius.pill,
  },
  xpPillText: {
    color: Theme.text,
    fontSize: 15,
    fontWeight: '800',
    fontFamily: 'Nunito_800ExtraBold',
  },
  feedbackCard: {
    backgroundColor: Theme.surface,
    borderRadius: Theme.radius.card,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Theme.cardBorderTint,
  },
  feedbackTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Theme.text,
    marginBottom: 6,
  },
  feedbackText: {
    fontSize: 14,
    color: Theme.muted,
    lineHeight: 22,
  },
  improvementCard: {
    backgroundColor: Theme.accent + '20',
    borderRadius: Theme.radius.card,
    padding: 18,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Theme.accent + '50',
  },
  improvementTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Theme.accent,
    marginBottom: 6,
  },
  improvementText: {
    fontSize: 14,
    color: Theme.text,
    lineHeight: 22,
  },
  doneButton: {
    borderRadius: Theme.radius.button,
    paddingVertical: 14,
    width: '100%',
  },
  doneButtonLabel: {
    color: Theme.text,
    fontSize: 17,
    fontWeight: '800',
    fontFamily: 'Nunito_800ExtraBold',
  },
});
