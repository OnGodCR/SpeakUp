import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import SpeakyMascot from '../../components/SpeakyMascot';
import { Theme } from '../../constants/colors';

const STEPS = [
  {
    emoji: '\uD83C\uDFAF',
    title: 'Get a topic',
    description: 'Receive a daily speaking challenge',
  },
  {
    emoji: '\uD83C\uDFA4',
    title: 'Speak for 5 minutes',
    description: 'Record your impromptu speech',
  },
  {
    emoji: '\uD83D\uDCCA',
    title: 'Get your score',
    description: 'AI-powered feedback on your performance',
  },
];

export default function HowItWorksScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topSection}>
          <View style={styles.mascotWrap}>
            <SpeakyMascot pose="thinking" scale={0.45} />
          </View>
          <Text style={styles.heading}>How it works</Text>
          <Text style={styles.subheading}>
            Three steps to a stronger voice
          </Text>
        </View>

        <View style={styles.stepsContainer}>
          {STEPS.map((step, index) => (
            <View key={index} style={styles.stepCard}>
              <View style={styles.emojiContainer}>
                <Text style={styles.emoji}>{step.emoji}</Text>
              </View>
              <View style={styles.stepText}>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepDescription}>{step.description}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => router.push('/(auth)/sign-up')}
        >
          <Text style={styles.buttonText}>I'm ready</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 24,
    paddingBottom: 24,
  },
  topSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  mascotWrap: {
    marginBottom: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: '800',
    fontFamily: 'Nunito_800ExtraBold',
    color: Theme.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subheading: {
    fontSize: 16,
    color: Theme.muted,
    textAlign: 'center',
  },
  stepsContainer: {
  },
  stepCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.surface,
    borderRadius: Theme.radius.bubbly,
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Theme.cardBorderTint,
  },
  emojiContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Theme.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 18,
  },
  emoji: {
    fontSize: 28,
  },
  stepText: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Theme.text,
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: Theme.muted,
    lineHeight: 22,
  },
  bottomContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 16,
  },
  button: {
    backgroundColor: Theme.primary,
    borderRadius: Theme.radius.bubblyButton,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Theme.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonPressed: {
    opacity: 0.9,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '800',
    fontFamily: 'Nunito_800ExtraBold',
    color: Theme.text,
  },
});
