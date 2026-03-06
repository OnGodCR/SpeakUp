import { create } from 'zustand';
import * as api from '../lib/api';
import type { DailyChallenge, SpeechScore } from '../lib/api';

interface ChallengeState {
  challenge: DailyChallenge | null;
  isLoading: boolean;
  score: SpeechScore | null;
  speechId: string | null;
  isRecording: boolean;
  isProcessing: boolean;
  fetchChallenge: () => Promise<void>;
  submitSpeech: (audioUri: string, durationSeconds: number) => Promise<void>;
  pollForScore: (speechId: string) => Promise<void>;
  reset: () => void;
}

export const useChallengeStore = create<ChallengeState>((set, get) => ({
  challenge: null,
  isLoading: false,
  score: null,
  speechId: null,
  isRecording: false,
  isProcessing: false,

  fetchChallenge: async () => {
    set({ isLoading: true });
    try {
      const challenge = await api.fetchDailyChallenge();
      set({ challenge, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  submitSpeech: async (audioUri: string, durationSeconds: number) => {
    const { challenge } = get();
    if (!challenge) throw new Error('No challenge loaded');

    set({ isProcessing: true });
    try {
      const result = await api.submitSpeech({
        challengeId: challenge.id,
        audioUri,
        durationSeconds,
      });
      set({ speechId: result.speechId, isProcessing: false });
      // Start polling for score
      get().pollForScore(result.speechId);
    } catch (error) {
      set({ isProcessing: false });
      throw error;
    }
  },

  pollForScore: async (speechId: string) => {
    set({ isProcessing: true });

    const poll = async (): Promise<void> => {
      try {
        const result = await api.pollScore(speechId);
        if (result.status === 'analyzed' && result.score) {
          set({ score: result.score, isProcessing: false });
        } else {
          await new Promise((resolve) => setTimeout(resolve, 2000));
          return poll();
        }
      } catch (error) {
        set({ isProcessing: false });
        throw error;
      }
    };

    await poll();
  },

  reset: () => {
    set({
      challenge: null,
      isLoading: false,
      score: null,
      speechId: null,
      isRecording: false,
      isProcessing: false,
    });
  },
}));
