import { create } from 'zustand';
import { Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { supabase } from '../lib/supabase';
import { getRedirectUrl, createSessionFromUrl } from '../lib/auth';
import { Session, User } from '@supabase/supabase-js';

// Required for WebBrowser.openAuthSessionAsync to work properly on web
WebBrowser.maybeCompleteAuthSession();

interface AuthState {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  isOnboarded: boolean;
  setSession: (session: Session | null) => void;
  setIsOnboarded: (value: boolean) => void;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
}

/** Ensure public.users has a row for the current auth user (e.g. after Google sign-in). */
async function ensureUserProfile(user: User): Promise<void> {
  const displayName =
    user.user_metadata?.full_name ??
    user.user_metadata?.name ??
    user.email?.split('@')[0] ??
    'User';
  await supabase.from('users').upsert(
    {
      id: user.id,
      email: user.email ?? '',
      display_name: displayName,
      avatar_url: user.user_metadata?.avatar_url ?? null,
    },
    { onConflict: 'id' }
  );
}

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  user: null,
  isLoading: true,
  isOnboarded: false,

  setSession: (session) => set({ session, user: session?.user ?? null }),

  setIsOnboarded: (value) => set({ isOnboarded: value }),

  signUp: async (email, password, displayName) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName } },
    });
    if (error) throw error;
    if (data.session) {
      set({ session: data.session, user: data.user });
      // Create user profile
      await supabase.from('users').insert({
        id: data.user?.id,
        email,
        display_name: displayName,
      });
    }
  },

  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    set({ session: data.session, user: data.user });
  },

  signInWithGoogle: async () => {
    const redirectTo = getRedirectUrl();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        skipBrowserRedirect: Platform.OS !== 'web',
      },
    });
    if (error) throw error;
    if (!data.url) throw new Error('No OAuth URL returned');

    if (Platform.OS === 'web') {
      window.location.href = data.url;
      return;
    }

    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
    if (result.type === 'success' && result.url) {
      await createSessionFromUrl(result.url);
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await ensureUserProfile(session.user);
      }
    }
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ session: null, user: null });
  },

  initialize: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      set({ session, user: session?.user ?? null, isLoading: false });
      if (session?.user) {
        ensureUserProfile(session.user).catch(() => {});
      }

      supabase.auth.onAuthStateChange(async (_event, session) => {
        set({ session, user: session?.user ?? null });
        if (session?.user) {
          ensureUserProfile(session.user).catch(() => {});
        }
      });
    } catch {
      set({ isLoading: false });
    }
  },
}));
