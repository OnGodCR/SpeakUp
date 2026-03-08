import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { BorderRadius, FontSize, FontWeight, Spacing } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuthStore } from '@/stores/authStore';

type ResendFeedback = {
  type: 'success' | 'error';
  message: string;
};

export default function SignUpScreen() {
  const router = useRouter();
  const { signUp, resendSignUpConfirmation } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successEmail, setSuccessEmail] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendFeedback, setResendFeedback] = useState<ResendFeedback | null>(null);
  const [resendCooldownUntil, setResendCooldownUntil] = useState<number | null>(null);
  const [now, setNow] = useState(Date.now());

  const RESEND_DEFAULT_COOLDOWN_SECONDS = 30;

  useEffect(() => {
    if (!resendCooldownUntil) return;

    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [resendCooldownUntil]);

  const resendSecondsRemaining = useMemo(() => {
    if (!resendCooldownUntil) return 0;

    return Math.max(0, Math.ceil((resendCooldownUntil - now) / 1000));
  }, [resendCooldownUntil, now]);

  const getRateLimitCooldownSeconds = (message: string) => {
    const secondMatch = message.match(/(\d+)\s*seconds?/i);
    if (secondMatch) return Number(secondMatch[1]);

    const minuteMatch = message.match(/(\d+)\s*minutes?/i);
    if (minuteMatch) return Number(minuteMatch[1]) * 60;

    return null;
  };

  const handleSignUp = async () => {
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    const { error: signUpError, requiresEmailConfirmation } = await signUp(email, password);
    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    if (requiresEmailConfirmation) {
      setSuccessEmail(email);
      setResendFeedback(null);
      setResendCooldownUntil(null);
      return;
    }
    // Auth listener in root layout will handle navigation on success
  };

  const handleResendConfirmation = async () => {
    if (!successEmail || resendLoading || resendSecondsRemaining > 0) return;

    setResendFeedback(null);
    setResendLoading(true);
    const { error: resendError } = await resendSignUpConfirmation(successEmail);
    setResendLoading(false);

    if (resendError) {
      setResendFeedback({ type: 'error', message: resendError.message });

      const cooldownFromError =
        getRateLimitCooldownSeconds(resendError.message) ??
        ((resendError as { status?: number }).status === 429
          ? RESEND_DEFAULT_COOLDOWN_SECONDS
          : null);

      if (cooldownFromError) {
        setResendCooldownUntil(Date.now() + cooldownFromError * 1000);
      }
      return;
    }

    setResendCooldownUntil(Date.now() + RESEND_DEFAULT_COOLDOWN_SECONDS * 1000);
    setResendFeedback({
      type: 'success',
      message: 'Confirmation email sent. Please check your inbox.',
    });
  };

  if (successEmail) {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.successContainer}>
          <Text style={styles.emoji}>{'\u{2709}'} </Text>
          <Text style={styles.title}>Check your email to verify your account.</Text>
          <Text style={styles.subtitle}>
            We sent a confirmation link to {successEmail}.
          </Text>

          {resendFeedback ? (
            <Text
              style={[
                styles.resendStatusText,
                resendFeedback.type === 'success' ? styles.successText : styles.errorText,
              ]}
            >
              {resendFeedback.message}
            </Text>
          ) : null}

          <Button
            title={
              resendSecondsRemaining > 0
                ? `Resend confirmation (${resendSecondsRemaining}s)`
                : 'Resend confirmation'
            }
            onPress={handleResendConfirmation}
            loading={resendLoading}
            disabled={resendLoading || resendSecondsRemaining > 0}
            style={{ marginTop: Spacing.lg }}
          />

          <TouchableOpacity
            onPress={() => router.replace('/(auth)/sign-in')}
            style={styles.backToSignInButton}
            activeOpacity={0.8}
          >
            <Text style={styles.footerLink}>Back to sign in</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
          <Text style={styles.emoji}>{'\u{1F680}'}</Text>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            Join thousands of speakers leveling up daily.
          </Text>
        </Animated.View>

        {/* Google OAuth button */}
        <Animated.View entering={FadeInDown.duration(400).delay(100)}>
          <TouchableOpacity style={styles.googleButton} activeOpacity={0.8}>
            <Text style={styles.googleIcon}>G</Text>
            <Text style={styles.googleText}>Continue with Google</Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.dividerRow}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.divider} />
        </View>

        <Animated.View entering={FadeInDown.duration(400).delay(200)}>
          <Input
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input
            label="Password"
            placeholder="At least 6 characters"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <Input
            label="Confirm Password"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Button
            title="Create Account"
            onPress={handleSignUp}
            loading={loading}
            style={{ marginTop: Spacing.md }}
          />
        </Animated.View>

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.replace('/(auth)/sign-in')}>
            <Text style={styles.footerLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    paddingHorizontal: Spacing.lg,
    paddingTop: 80,
    paddingBottom: 40,
  },
  header: {
    marginBottom: Spacing.xl,
    alignItems: 'center',
  },
  emoji: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md + 2,
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    minHeight: 58,
  },
  googleIcon: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  googleText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.surfaceBorder,
  },
  dividerText: {
    color: Colors.textMuted,
    marginHorizontal: Spacing.md,
    fontSize: FontSize.sm,
  },
  errorText: {
    color: Colors.error,
    fontSize: FontSize.sm,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  resendStatusText: {
    fontSize: FontSize.sm,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  successText: {
    color: Colors.success,
  },
  backToSignInButton: {
    marginTop: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.xl,
  },
  footerText: {
    color: Colors.textMuted,
    fontSize: FontSize.sm,
  },
  footerLink: {
    color: Colors.primary,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
  },
});
