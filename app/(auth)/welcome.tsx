import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import SpeakyMascot from '../../components/SpeakyMascot';
import { Theme } from '../../constants/colors';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.mascotSection}>
          <View style={styles.mascotBase} />
          <View style={styles.mascotWrap}>
            <SpeakyMascot pose="friendly" scale={0.8} />
          </View>
        </View>

        <Text style={styles.brandName}>SpeakUp</Text>
        <Text style={styles.tagline}>
          Get better at speaking. One challenge a day.
        </Text>
      </View>

      <View style={styles.bottom}>
        <Pressable
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => router.push('/(auth)/how-it-works')}
        >
          <Text style={styles.primaryButtonText}>Get started</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.secondaryButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => router.push('/(auth)/sign-in')}
        >
          <Text style={styles.secondaryButtonText}>
            I already have an account
          </Text>
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  mascotSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  mascotBase: {
    position: 'absolute',
    bottom: 0,
    width: 220,
    height: 24,
    borderRadius: 12,
    backgroundColor: Theme.surface,
    opacity: 0.6,
  },
  mascotWrap: {
    marginBottom: 8,
  },
  brandName: {
    fontSize: 32,
    fontWeight: '800',
    fontFamily: 'Nunito_800ExtraBold',
    color: Theme.primary,
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: 16,
    color: Theme.muted,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  bottom: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 24,
  },
  primaryButton: {
    backgroundColor: Theme.primary,
    borderRadius: Theme.radius.bubblyButton,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Theme.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '800',
    fontFamily: 'Nunito_800ExtraBold',
    color: Theme.text,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderRadius: Theme.radius.bubblyButton,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Theme.primary,
    marginTop: 14,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Theme.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  buttonPressed: {
    opacity: 0.9,
  },
});
