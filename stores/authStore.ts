import { create } from 'zustand';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthState {
  session: Session | null;
  user: User | null;
  loading: boolean;
  hasOnboarded: boolean;
  setSession: (session: Session | null) => void;
  setHasOnboarded: (value: boolean) => void;
  signUp: (
    email: string,
    password: string
  ) => Promise<{ error: Error | null; requiresEmailConfirmation: boolean }>;
  resendSignUpConfirmation: (email: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
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
    const { data, error } = await supabase.auth.signUp({ email, password });

    return {
      error: error as Error | null,
      requiresEmailConfirmation: Boolean(data.user) && !data.session,
    };
  },

  resendSignUpConfirmation: async (email) => {
    const { error } = await supabase.auth.resend({
      email,
      type: 'signup',
    });

    return { error: error as Error | null };
  },

  signIn: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error as Error | null };
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ session: null, user: null });
  },
}));
