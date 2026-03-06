import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { useAuthStore } from './authStore';

export interface UserProfile {
  id: string;
  display_name: string;
  avatar_url: string | null;
  current_streak: number;
  longest_streak: number;
  total_xp: number;
  level: number;
  last_challenge_date: string | null;
  streak_shield_available: boolean;
  notification_time: string | null;
  timezone: string | null;
}

export interface SpeechHistory {
  id: string;
  date: string;
  topic_snippet: string;
  score: number;
  clarity_score: number;
  confidence_score: number;
  grammar_score: number;
  filler_word_count: number;
}

interface UserState {
  profile: UserProfile | null;
  isLoading: boolean;
  speeches: SpeechHistory[];
  fetchProfile: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  refreshStats: () => Promise<void>;
  fetchSpeechHistory: () => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  profile: null,
  isLoading: false,
  speeches: [],

  fetchProfile: async () => {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) return;

    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      set({ profile: data as UserProfile, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  updateProfile: async (updates: Partial<UserProfile>) => {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) return;

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    set({ profile: data as UserProfile });
  },

  refreshStats: async () => {
    await get().fetchProfile();
  },

  fetchSpeechHistory: async () => {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) return;

    set({ isLoading: true });
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data, error } = await supabase
        .from('speeches')
        .select(`
          id,
          created_at,
          challenge_id,
          scores (
            overall_score,
            clarity_score,
            confidence_score,
            grammar_score,
            filler_word_count
          ),
          challenges (
            topic
          )
        `)
        .eq('user_id', userId)
        .gte('created_at', sevenDaysAgo.toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;

      const speeches: SpeechHistory[] = (data ?? []).map((speech: any) => ({
        id: speech.id,
        date: speech.created_at,
        topic_snippet: speech.challenges?.topic?.substring(0, 80) ?? '',
        score: speech.scores?.overall_score ?? 0,
        clarity_score: speech.scores?.clarity_score ?? 0,
        confidence_score: speech.scores?.confidence_score ?? 0,
        grammar_score: speech.scores?.grammar_score ?? 0,
        filler_word_count: speech.scores?.filler_word_count ?? 0,
      }));

      set({ speeches, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
}));
