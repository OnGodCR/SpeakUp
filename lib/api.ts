import { supabase } from './supabase';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DailyChallenge {
  id: string;
  topic: string;
  category: string;
  difficulty_tier: string;
  hint: string | null;
  already_completed: boolean;
}

export interface SpeechScore {
  overall_score: number;
  filler_word_count: number;
  filler_words_per_min: number;
  words_per_minute: number;
  speaking_pct: number;
  pace_score: number;
  clarity_score: number;
  structure_score: number;
  feedback_text: string;
  key_improvement: string;
  xp_earned: number;
}

export interface ScoreResponse {
  status: 'processing' | 'analyzed' | 'failed';
  score: SpeechScore | null;
}

export interface FriendActivity {
  id: string;
  display_name: string;
  avatar_url: string | null;
  current_streak: number;
  level: number;
  today_score: number | null;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Return the current session's access token for use in manual fetch calls.
 */
async function getAccessToken(): Promise<string> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.access_token ?? '';
}

/**
 * Build the full URL for a Supabase Edge Function endpoint.
 */
function functionsUrl(path: string): string {
  const base = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
  return `${base}/functions/v1/${path}`;
}

// ---------------------------------------------------------------------------
// API functions
// ---------------------------------------------------------------------------

/**
 * Fetch today's daily speaking challenge.
 */
export async function fetchDailyChallenge(): Promise<DailyChallenge> {
  const { data, error } = await supabase.functions.invoke('daily-challenge', {
    method: 'GET',
  });

  if (error) throw error;
  return data as DailyChallenge;
}

/**
 * Submit a recorded speech for scoring.
 *
 * Accepts a local file URI (from Expo Audio), converts it to a blob,
 * and uploads via multipart/form-data.
 */
export async function submitSpeech(params: {
  challengeId: string;
  audioUri: string;
  durationSeconds: number;
}): Promise<{ speechId: string }> {
  const token = await getAccessToken();

  // Convert local file URI to a Blob for upload
  const audioResponse = await fetch(params.audioUri);
  const audioBlob = await audioResponse.blob();

  const formData = new FormData();
  formData.append('audio', audioBlob, 'recording.m4a');
  formData.append('challenge_id', params.challengeId);
  formData.append('duration_seconds', String(params.durationSeconds));

  const response = await fetch(functionsUrl('submit-speech'), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`submit-speech failed (${response.status}): ${text}`);
  }

  const data = await response.json();
  return { speechId: data.speech_id };
}

/**
 * Poll for the speech score by querying the speech status and scores table.
 */
export async function pollScore(speechId: string): Promise<ScoreResponse> {
  const { data: speech, error } = await supabase
    .from('speeches')
    .select(`
      status,
      scores (
        overall_score,
        filler_word_count,
        filler_words_per_min,
        words_per_minute,
        speaking_pct,
        pace_score,
        clarity_score,
        structure_score,
        feedback_text,
        key_improvement,
        xp_earned
      )
    `)
    .eq('id', speechId)
    .single();

  if (error) throw error;

  const status = speech.status as ScoreResponse['status'];
  const scoreRow = (speech as any).scores;

  return {
    status,
    score: status === 'analyzed' && scoreRow ? (scoreRow as SpeechScore) : null,
  };
}

/**
 * Notify the backend to update the user's streak after a completed session.
 */
export async function updateStreak(): Promise<{
  current_streak: number;
  milestone_xp: number;
}> {
  const { data, error } = await supabase.functions.invoke('update-streak', {
    method: 'POST',
  });

  if (error) throw error;
  return data as { current_streak: number; milestone_xp: number };
}

/**
 * Fetch recent activity from the user's friends.
 */
export async function fetchFriendsActivity(): Promise<FriendActivity[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  // Get accepted friendships
  const { data: friendships, error: fErr } = await supabase
    .from('friendships')
    .select('user_id, friend_id')
    .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)
    .eq('status', 'accepted');

  if (fErr || !friendships?.length) return [];

  const friendIds = friendships.map((f) =>
    f.user_id === user.id ? f.friend_id : f.user_id,
  );

  const today = new Date().toISOString().split('T')[0];

  const { data: friends, error: uErr } = await supabase
    .from('users')
    .select('id, display_name, avatar_url, current_streak, level')
    .in('id', friendIds);

  if (uErr || !friends) return [];

  // Get today's scores for friends
  const { data: todaySpeeches } = await supabase
    .from('speeches')
    .select('user_id, scores(overall_score)')
    .in('user_id', friendIds)
    .gte('created_at', `${today}T00:00:00`)
    .eq('status', 'analyzed');

  const scoreMap = new Map<string, number>();
  for (const s of todaySpeeches ?? []) {
    const score = (s as any).scores?.overall_score;
    if (score != null) scoreMap.set(s.user_id, score);
  }

  return friends.map((f) => ({
    id: f.id,
    display_name: f.display_name,
    avatar_url: f.avatar_url,
    current_streak: f.current_streak,
    level: f.level,
    today_score: scoreMap.get(f.id) ?? null,
  }));
}
