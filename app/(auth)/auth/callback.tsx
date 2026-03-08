import { useEffect, useRef } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../../lib/supabase';
import { Theme } from '../../../constants/Colors';

/**
 * OAuth callback route. On web, Supabase redirects here after OAuth.
 * We rely on the auth state listener/session check and redirect into the app once a session exists.
 */
export default function AuthCallbackScreen() {
  const router = useRouter();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;

    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        handled.current = true;
        router.replace('/(tabs)');
      }
    };

    checkSession();
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
