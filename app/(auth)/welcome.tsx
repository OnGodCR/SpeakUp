import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { BorderRadius, FontSize, FontWeight, Spacing } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeInDown.duration(600)} style={styles.heroSection}>
        {/* Speaky mascot in card */}
        <Card style={styles.mascotCard} accent>
          <Text style={styles.mascotEmoji}>{'\u{1F399}\uFE0F'}</Text>
          <View style={styles.speechBubble}>
            <View style={styles.speechArrow} />
            <Text style={styles.speechText}>
              Ready to become a speaker people actually listen to?
            </Text>
          </View>
        </Card>

        <Animated.Text entering={FadeInDown.duration(500).delay(200)} style={styles.title}>
          SpeakUp
        </Animated.Text>
        <Animated.Text entering={FadeInDown.duration(500).delay(350)} style={styles.subtitle}>
          Your AI public speaking coach.{'\n'}Daily challenges. Real feedback. No judgment.
        </Animated.Text>
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(500).delay(500)} style={styles.bottomSection}>
        <Button
          title="Get Started"
          onPress={() => router.push('/(auth)/how-it-works')}
        />
        <Button
          title="I already have an account"
          onPress={() => router.push('/(auth)/sign-in')}
          variant="ghost"
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
    justifyContent: 'space-between',
    paddingTop: 80,
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  mascotCard: {
    alignItems: 'center',
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    width: '100%',
  },
  mascotEmoji: {
    fontSize: 80,
    marginBottom: Spacing.md,
  },
  speechBubble: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    width: '100%',
    position: 'relative',
  },
  speechArrow: {
    position: 'absolute',
    top: -8,
    alignSelf: 'center',
    left: '50%',
    marginLeft: -8,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: Colors.background,
  },
  speechText: {
    color: Colors.textPrimary,
    fontSize: FontSize.sm,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 22,
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
});
