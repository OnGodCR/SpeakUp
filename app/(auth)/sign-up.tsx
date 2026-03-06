import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput, Button, Snackbar, Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../stores/authStore';

const BRAND = {
  primary: '#6C3CE1',
  accent: '#FF6B35',
  dark: '#1A1A2E',
  gray: '#6B7280',
  white: '#FFFFFF',
};

export default function SignUpScreen() {
  const router = useRouter();
  const { signUp, signInWithGoogle } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [notificationTime, setNotificationTime] = useState('');
  const [secureText, setSecureText] = useState(true);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const validate = (): string | null => {
    if (!displayName.trim()) {
      return 'Display name is required.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return 'Please enter a valid email address.';
    }
    if (password.length < 6) {
      return 'Password must be at least 6 characters.';
    }
    return null;
  };

  const showError = (message: string) => {
    setError(message);
    setSnackbarVisible(true);
  };

  const handleSignUp = async () => {
    const validationError = validate();
    if (validationError) {
      showError(validationError);
      return;
    }

    setLoading(true);
    try {
      await signUp(email.trim(), password, displayName.trim());
    } catch (err: any) {
      showError(err.message ?? 'Sign up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      showError(err.message ?? 'Google sign in failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Create Account</Text>

          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            style={styles.input}
            outlineColor={BRAND.gray}
            activeOutlineColor={BRAND.primary}
          />

          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            secureTextEntry={secureText}
            right={
              <TextInput.Icon
                icon={secureText ? 'eye-off' : 'eye'}
                onPress={() => setSecureText(!secureText)}
              />
            }
            style={styles.input}
            outlineColor={BRAND.gray}
            activeOutlineColor={BRAND.primary}
          />

          <TextInput
            label="Display Name"
            value={displayName}
            onChangeText={setDisplayName}
            mode="outlined"
            autoCapitalize="words"
            style={styles.input}
            outlineColor={BRAND.gray}
            activeOutlineColor={BRAND.primary}
          />

          <TextInput
            label="Notification Time"
            value={notificationTime}
            onChangeText={setNotificationTime}
            mode="outlined"
            placeholder="08:00 AM"
            style={styles.input}
            outlineColor={BRAND.gray}
            activeOutlineColor={BRAND.primary}
          />

          <Button
            mode="outlined"
            onPress={handleGoogle}
            loading={googleLoading}
            disabled={googleLoading}
            style={styles.googleButton}
            labelStyle={styles.googleButtonLabel}
            icon="google"
          >
            Continue with Google
          </Button>

          <Button
            mode="contained"
            onPress={handleSignUp}
            loading={loading}
            disabled={loading}
            style={styles.createButton}
            labelStyle={styles.createButtonLabel}
            buttonColor={BRAND.primary}
          >
            Create Account
          </Button>

          <Pressable onPress={() => router.push('/(auth)/sign-in' as any)}>
            <Text style={styles.signInLink}>
              Already have an account? <Text style={styles.signInLinkBold}>Sign In</Text>
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{ label: 'OK', onPress: () => setSnackbarVisible(false) }}
      >
        {error}
      </Snackbar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BRAND.white,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 32,
    paddingTop: 24,
    paddingBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: BRAND.dark,
    marginBottom: 32,
  },
  input: {
    marginBottom: 16,
    backgroundColor: BRAND.white,
  },
  googleButton: {
    marginTop: 8,
    borderColor: BRAND.gray,
    borderRadius: 28,
    paddingVertical: 4,
  },
  googleButtonLabel: {
    color: BRAND.dark,
    fontSize: 16,
  },
  createButton: {
    marginTop: 16,
    borderRadius: 28,
    paddingVertical: 4,
  },
  createButtonLabel: {
    color: BRAND.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  signInLink: {
    textAlign: 'center',
    marginTop: 24,
    fontSize: 14,
    color: BRAND.gray,
  },
  signInLinkBold: {
    color: BRAND.primary,
    fontWeight: 'bold',
  },
});
