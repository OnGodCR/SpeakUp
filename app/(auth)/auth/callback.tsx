import { useEffect, useRef } from 'react';
import { View, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../../lib/supabase';
import { createSessionFromUrl } from '../../../lib/auth';
import { Theme } from '../../../constants/colors';

/**
 * OAuth callback route for web redirects.
 * This page explicitly parses callback URL tokens and sets the session.
 * Native Expo flow continues to parse callback URLs via createSessionFromUrl(url)
 * in its deep-link/auth-session path.
 */
export default function AuthCallbackScreen() {
  const router = useRouter();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;

    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        handled.current = true;
        router.replace('/(tabs)');
      }
    };

    const bootstrapSession = async () => {
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        try {
          await createSessionFromUrl(window.location.href);
        } catch {
          // If URL has no OAuth tokens, rely on existing session/auth-state updates.
        }
      }
      await checkSession();
    };

    bootstrapSession();
    const interval = setInterval(checkSession, 300);
    const sub = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        handled.current = true;
        clearInterval(interval);
        router.replace('/(tabs)');
      }
    });

    return () => {
      clearInterval(interval);
      sub.data.subscription.unsubscribe();
    };
  }, [router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Theme.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.background,
  },
});
