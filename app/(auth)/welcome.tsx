import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { BorderRadius, FontSize, FontWeight, Spacing } from '@/constants/theme';
import { Button } from '@/components/ui/Button';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.heroSection}>
        {/* Speaky mascot placeholder */}
        <View style={styles.mascotContainer}>
          <Text style={styles.mascotEmoji}>🎙️</Text>
          <View style={styles.speechBubble}>
            <Text style={styles.speechText}>
              Ready to become a speaker people actually listen to?
            </Text>
          </View>
        </View>

        <Text style={styles.title}>SpeakUp</Text>
        <Text style={styles.subtitle}>
          Your AI public speaking coach.{'\n'}Daily challenges. Real feedback. No judgment.
        </Text>
      </View>

      <View style={styles.bottomSection}>
        <Button
          title="Get Started"
          onPress={() => router.push('/(auth)/how-it-works')}
          style={styles.primaryButton}
        />
        <Button
          title="I already have an account"
          onPress={() => router.push('/(auth)/sign-in')}
          variant="ghost"
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
    justifyContent: 'space-between',
    paddingTop: 80,
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  mascotContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  mascotEmoji: {
    fontSize: 80,
  },
  speechBubble: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginTop: Spacing.md,
    maxWidth: width * 0.7,
  },
  speechText: {
    color: Colors.textPrimary,
    fontSize: FontSize.sm,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  title: {
    fontSize: FontSize.hero,
    fontWeight: FontWeight.extrabold,
    color: Colors.primary,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 24,
  },
  bottomSection: {
    gap: Spacing.sm,
  },
  primaryButton: {
    width: '100%',
  },
});
