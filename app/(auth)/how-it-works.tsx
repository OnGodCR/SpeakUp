import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, { FadeInDown, FadeInUp, FadeIn } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { BorderRadius, FontSize, FontWeight, Spacing } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';

const { width } = Dimensions.get('window');

const STEPS = [
  {
    icon: '\u{1F3AF}',
    title: 'Daily Challenge',
    description: 'Get a fresh speaking prompt every day \u2014 from elevator pitches to debate topics.',
  },
  {
    icon: '\u{1F3A4}',
    title: 'Record Your Speech',
    description: '1\u20135 minutes. Just you, the mic, and your thoughts. No retakes needed.',
  },
  {
    icon: '\u{1F916}',
    title: 'AI Feedback',
    description: 'Speaky analyzes your pace, filler words, and structure \u2014 instant, honest coaching.',
  },
  {
    icon: '\u{1F525}',
    title: 'Build Your Streak',
    description: 'Earn XP, level up, and compete with friends. Consistency is the secret.',
  },
];

export default function HowItWorksScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  const isLastStep = currentStep === STEPS.length - 1;
  const step = STEPS[currentStep];

  return (
    <View style={styles.container}>
      {/* Progress bar */}
      <Animated.View entering={FadeInDown.duration(400)}>
        <ProgressBar
          progress={((currentStep + 1) / STEPS.length) * 100}
          color={Colors.primary}
          height={6}
          style={styles.progressBar}
        />
      </Animated.View>

      {/* Step dots */}
      <View style={styles.dotsRow}>
        {STEPS.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i === currentStep && styles.dotActive,
              i < currentStep && styles.dotDone,
            ]}
          />
        ))}
      </View>

      <View style={styles.content}>
        <Animated.View
          entering={FadeIn.duration(400)}
          key={currentStep}
        >
          <Card style={styles.stepCard} accent>
            <Text style={styles.icon}>{step.icon}</Text>
            <Text style={styles.title}>{step.title}</Text>
            <Text style={styles.description}>{step.description}</Text>
          </Card>
        </Animated.View>
      </View>

      <Animated.View entering={FadeInUp.duration(400)} style={styles.bottomSection}>
        <Button
          title={isLastStep ? "Let's Go" : 'Next'}
          onPress={() => {
            if (isLastStep) {
              router.push('/(auth)/sign-up');
            } else {
              setCurrentStep(currentStep + 1);
            }
          }}
        />
        <Button
          title="Skip"
          variant="ghost"
          onPress={() => router.push('/(auth)/sign-up')}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.lg,
    paddingTop: 80,
    paddingBottom: 40,
  },
  progressBar: {
    marginBottom: Spacing.lg,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xxl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
  },
  dotActive: {
    backgroundColor: Colors.primary,
    width: 28,
  },
  dotDone: {
    backgroundColor: Colors.accent,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  stepCard: {
    alignItems: 'center',
    padding: Spacing.xl,
  },
  icon: {
    fontSize: 72,
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  description: {
    fontSize: FontSize.md,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: width * 0.8,
  },
  bottomSection: {
    gap: Spacing.sm,
  },
});
