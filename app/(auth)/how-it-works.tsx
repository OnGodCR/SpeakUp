import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const BRAND = {
  primary: '#6C3CE1',
  accent: '#FF6B35',
  dark: '#1A1A2E',
  gray: '#6B7280',
  white: '#FFFFFF',
};

const STEPS = [
  {
    emoji: '\uD83C\uDFAF',
    title: 'Get a Topic',
    description: 'Receive a daily speaking challenge',
  },
  {
    emoji: '\uD83C\uDFA4',
    title: 'Speak for 5 Minutes',
    description: 'Record your impromptu speech',
  },
  {
    emoji: '\uD83D\uDCCA',
    title: 'Get Your Score',
    description: 'AI-powered feedback on your performance',
  },
];

export default function HowItWorksScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.heading}>How It Works</Text>

        <View style={styles.stepsContainer}>
          {STEPS.map((step, index) => (
            <View key={index} style={styles.stepRow}>
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
      </View>

      <View style={styles.bottomContainer}>
        <Pressable
          style={styles.button}
          onPress={() => router.push('/(auth)/sign-up')}
        >
          <Text style={styles.buttonText}>I'm Ready</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BRAND.white,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: BRAND.dark,
    textAlign: 'center',
    marginBottom: 40,
  },
  stepsContainer: {
    gap: 28,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emojiContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#F3F0FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  emoji: {
    fontSize: 28,
  },
  stepText: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: BRAND.dark,
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: BRAND.gray,
    lineHeight: 20,
  },
  bottomContainer: {
    paddingHorizontal: 32,
    paddingBottom: 32,
  },
  button: {
    backgroundColor: BRAND.primary,
    borderRadius: 28,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: BRAND.white,
  },
});
