import { Platform } from 'react-native';
import { makeRedirectUri } from 'expo-auth-session';
import { supabase } from './supabase';

/** Parse query params from URL; Supabase puts tokens in the hash (e.g. #access_token=...). */
function getParamsFromUrl(url: string): Record<string, string> {
  const params: Record<string, string> = {};
  const hashIndex = url.indexOf('#');
  if (hashIndex !== -1) {
    new URLSearchParams(url.slice(hashIndex + 1)).forEach((value, key) => {
      params[key] = value;
    });
  }
  if (url.startsWith('http')) {
    try {
      const parsed = new URL(url);
      parsed.searchParams.forEach((value, key) => {
        params[key] = value;
      });
      if (parsed.hash && hashIndex === -1) {
        new URLSearchParams(parsed.hash.replace(/^#/, '')).forEach((value, key) => {
          params[key] = value;
        });
      }
    } catch {
      // ignore
    }
  }
  return params;
}

/**
 * Get the OAuth redirect URL for the current platform.
 * - Web: origin + /auth/callback (so Supabase redirects back to our app)
 * - Native: custom scheme URL from makeRedirectUri (e.g. speakup://redirect)
 */
export function getRedirectUrl(): string {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    return `${window.location.origin}/auth/callback`;
  }
  return makeRedirectUri({ path: 'auth/callback' });
}

/**
 * Parse the OAuth redirect URL (from Supabase) and set the session.
 * Used after Google sign-in when handling a callback URL on web or when
 * the native app is opened via deep link/WebBrowser.openAuthSessionAsync.
 */
export async function createSessionFromUrl(url: string): Promise<void> {
  const params = getParamsFromUrl(url);
  const errorCode = params.error_description ?? params.error;
  if (errorCode || !params.access_token) {
    throw new Error(errorCode ?? 'No access token in redirect');
  }
  const { error } = await supabase.auth.setSession({
    access_token: params.access_token,
    refresh_token: params.refresh_token ?? '',
  });
  if (error) throw error;
}
