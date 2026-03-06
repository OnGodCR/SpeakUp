import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput, Button, Snackbar, Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../stores/authStore';
import { Theme } from '../../constants/colors';

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
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Create account</Text>
          <Text style={styles.subtitle}>
            Join SpeakUp and start your first challenge
          </Text>

          <TextInput
            label="Display name"
            value={displayName}
            onChangeText={setDisplayName}
            mode="outlined"
            autoCapitalize="words"
            style={styles.input}
            outlineColor={Theme.muted}
            activeOutlineColor={Theme.accent}
          />

          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            style={styles.input}
            outlineColor={Theme.muted}
            activeOutlineColor={Theme.accent}
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
            outlineColor={Theme.muted}
            activeOutlineColor={Theme.accent}
          />

          <TextInput
            label="Notification time (optional)"
            value={notificationTime}
            onChangeText={setNotificationTime}
            mode="outlined"
            placeholder="e.g. 08:00 AM"
            style={styles.input}
            outlineColor={Theme.muted}
            activeOutlineColor={Theme.accent}
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
            buttonColor={Theme.primary}
          >
            Create account
          </Button>

          <Pressable onPress={() => router.push('/(auth)/sign-in' as any)}>
            <Text style={styles.signInLink}>
              Already have an account?{' '}
              <Text style={styles.signInLinkBold}>Sign in</Text>
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
    backgroundColor: Theme.background,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 32,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    fontFamily: 'Nunito_800ExtraBold',
    color: Theme.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Theme.muted,
    marginBottom: 28,
  },
  input: {
    marginBottom: 20,
    backgroundColor: Theme.surface,
    borderRadius: Theme.radius.bubbly,
  },
  googleButton: {
    marginTop: 8,
    marginBottom: 20,
    borderColor: Theme.primary,
    borderRadius: Theme.radius.bubblyButton,
    paddingVertical: 8,
  },
  googleButtonLabel: {
    color: Theme.primary,
    fontSize: 16,
    fontWeight: '700',
  },
  createButton: {
    borderRadius: Theme.radius.bubblyButton,
    paddingVertical: 8,
    shadowColor: Theme.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  createButtonLabel: {
    color: Theme.text,
    fontSize: 17,
    fontWeight: '800',
    fontFamily: 'Nunito_800ExtraBold',
  },
  signInLink: {
    textAlign: 'center',
    marginTop: 28,
    fontSize: 15,
    color: Theme.muted,
  },
  signInLinkBold: {
    color: Theme.primary,
    fontWeight: '700',
  },
});
