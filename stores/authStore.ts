import { create } from 'zustand';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { createSessionFromUrl, getRedirectUrl } from '@/lib/auth';

WebBrowser.maybeCompleteAuthSession();

interface AuthState {
  session: Session | null;
  user: User | null;
  loading: boolean;
  hasOnboarded: boolean;
  setSession: (session: Session | null) => void;
  setHasOnboarded: (value: boolean) => void;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  loading: true,
  hasOnboarded: false,

  setSession: (session) =>
    set({ session, user: session?.user ?? null, loading: false }),

  setHasOnboarded: (value) => set({ hasOnboarded: value }),

  signUp: async (email, password) => {
    const { error } = await supabase.auth.signUp({ email, password });
    return { error: error as Error | null };
  },

  signIn: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error as Error | null };
  },

  signInWithGoogle: async () => {
    try {
      const redirectTo = getRedirectUrl();

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          skipBrowserRedirect: Platform.OS !== 'web',
        },
      });

      if (error) return { error: error as Error };

      if (Platform.OS === 'web') {
        return { error: null };
      }

      if (!data?.url) return { error: new Error('Failed to start Google sign-in.') };

      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
      if (result.type === 'success' && result.url) {
        await createSessionFromUrl(result.url);
        return { error: null };
      }

      if (result.type === 'cancel' || result.type === 'dismiss') {
        return { error: new Error('Google sign-in cancelled.') };
      }

      return { error: new Error('Google sign-in did not complete.') };
    } catch (error) {
      return { error: error as Error };
    }
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ session: null, user: null });
  },
}));
