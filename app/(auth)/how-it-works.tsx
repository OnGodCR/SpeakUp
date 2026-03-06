import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { BorderRadius, FontSize, FontWeight, Spacing } from '@/constants/theme';
import { Button } from '@/components/ui/Button';

const { width } = Dimensions.get('window');

const STEPS = [
  {
    icon: '🎯',
    title: 'Daily Challenge',
    description: 'Get a fresh speaking prompt every day — from elevator pitches to debate topics.',
  },
  {
    icon: '🎤',
    title: 'Record Your Speech',
    description: '1–5 minutes. Just you, the mic, and your thoughts. No retakes needed.',
  },
  {
    icon: '🤖',
    title: 'AI Feedback',
    description: 'Speaky analyzes your pace, filler words, and structure — instant, honest coaching.',
  },
  {
    icon: '🔥',
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
      {/* Progress dots */}
      <View style={styles.dotsRow}>
        {STEPS.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, i === currentStep && styles.dotActive]}
          />
        ))}
      </View>

      <View style={styles.content}>
        <Text style={styles.icon}>{step.icon}</Text>
        <Text style={styles.title}>{step.title}</Text>
        <Text style={styles.description}>{step.description}</Text>
      </View>

      <View style={styles.bottomSection}>
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
      </View>
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
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xxl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.surface,
  },
  dotActive: {
    backgroundColor: Colors.primary,
    width: 24,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
