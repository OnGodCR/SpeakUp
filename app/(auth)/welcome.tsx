import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Speaky from '../../components/Speaky';

const BRAND = {
  primary: '#6C3CE1',
  accent: '#FF6B35',
  dark: '#1A1A2E',
  gray: '#6B7280',
  white: '#FFFFFF',
};

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Speaky size="large" mood="happy" />
        <Text style={styles.title}>Hey! I'm Speaky.</Text>
        <Text style={styles.subtitle}>Ready to become a better speaker?</Text>
      </View>

      <View style={styles.bottomContainer}>
        <Pressable
          style={styles.button}
          onPress={() => router.push('/(auth)/how-it-works')}
        >
          <Text style={styles.buttonText}>Let's Go</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BRAND.primary,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: BRAND.white,
    marginTop: 24,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: BRAND.white,
    marginTop: 12,
    textAlign: 'center',
  },
  bottomContainer: {
    paddingHorizontal: 32,
    paddingBottom: 32,
  },
  button: {
    backgroundColor: BRAND.white,
    borderRadius: 28,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: BRAND.primary,
  },
});
