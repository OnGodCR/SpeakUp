import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from 'react-native-paper';
import { useRouter } from 'expo-router';

import Speaky from '../../components/Speaky';
import StreakBadge from '../../components/StreakBadge';
import ChallengeCard from '../../components/ChallengeCard';
import { useUserStore } from '../../stores/userStore';
import { useChallengeStore } from '../../stores/challengeStore';
import { useAuthStore } from '../../stores/authStore';
import { getGreeting } from '../../constants/speakyMessages';
import { fetchFriendsActivity, FriendActivity } from '../../lib/api';

const BRAND = {
  primary: '#6C3CE1',
  accent: '#FF6B35',
  dark: '#1A1A2E',
  gray: '#6B7280',
  background: '#F8F9FA',
  white: '#FFFFFF',
};

export default function HomeScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const profile = useUserStore((s) => s.profile);
  const fetchProfile = useUserStore((s) => s.fetchProfile);
  const challenge = useChallengeStore((s) => s.challenge);
  const fetchChallenge = useChallengeStore((s) => s.fetchChallenge);

  const [refreshing, setRefreshing] = useState(false);
  const [friends, setFriends] = useState<FriendActivity[]>([]);

  const streak = profile?.current_streak ?? 0;
  const level = profile?.level ?? 1;
  const displayName = profile?.display_name ?? user?.user_metadata?.display_name ?? '';
  const avatarUrl = profile?.avatar_url ?? null;
  const initial = displayName ? displayName.charAt(0).toUpperCase() : '?';

  const todayScore =
    challenge?.already_completed && useChallengeStore.getState().score
      ? useChallengeStore.getState().score?.overall_score ?? null
      : null;

  const loadData = useCallback(async () => {
    try {
      await Promise.all([
        fetchProfile(),
        fetchChallenge(),
        fetchFriendsActivity()
          .then(setFriends)
          .catch(() => setFriends([])),
      ]);
    } catch {
      // silently handle
    }
  }, [fetchProfile, fetchChallenge]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={BRAND.primary} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header Row ── */}
        <View style={styles.headerRow}>
          {/* Avatar */}
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarInitial}>{initial}</Text>
            </View>
          )}

          {/* Streak center */}
          <StreakBadge streak={streak} size="small" />

          {/* Level badge */}
          <View style={styles.levelBadge}>
            <View style={styles.levelCircle}>
              <Text style={styles.levelText}>Lv.{level}</Text>
            </View>
          </View>
        </View>

        {/* ── Speaky Section ── */}
        <View style={styles.speakySection}>
          <Speaky message={getGreeting(streak)} mood="happy" size="large" />
        </View>

        {/* ── Daily Challenge Card ── */}
        {challenge ? (
          <ChallengeCard
            topic={challenge.topic}
            category={challenge.category}
            isCompleted={challenge.already_completed}
            score={todayScore ?? undefined}
            onStart={() => router.push('/challenge/prep')}
            onViewScore={
              challenge.already_completed
                ? () => router.push('/challenge/prep')
                : undefined
            }
          />
        ) : null}

        {/* ── Quick Stats Row ── */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{streak}</Text>
            <Text style={styles.statLabel}>Current Streak</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>
              {todayScore != null ? todayScore : '---'}
            </Text>
            <Text style={styles.statLabel}>Today's Score</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>---</Text>
            <Text style={styles.statLabel}>Weekly Avg</Text>
          </View>
        </View>

        {/* ── Friends Activity ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Friends Activity</Text>
        </View>

        {friends.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.friendsScroll}
          >
            {friends.map((friend) => (
              <View key={friend.id} style={styles.friendBubble}>
                {friend.avatar_url ? (
                  <Image source={{ uri: friend.avatar_url }} style={styles.friendAvatar} />
                ) : (
                  <View style={styles.friendAvatarFallback}>
                    <Text style={styles.friendAvatarInitial}>
                      {friend.display_name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                )}
                <Text style={styles.friendName} numberOfLines={1}>
                  {friend.display_name}
                </Text>
                <Text style={styles.friendScore}>
                  {friend.today_score != null ? friend.today_score : '--'}
                </Text>
              </View>
            ))}
          </ScrollView>
        ) : (
          <View style={styles.emptyFriends}>
            <Text style={styles.emptyFriendsText}>
              Add friends to see their progress!
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BRAND.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },

  /* Header */
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    paddingBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarFallback: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8D5FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontSize: 16,
    fontWeight: '700',
    color: BRAND.primary,
  },
  levelBadge: {
    alignItems: 'center',
  },
  levelCircle: {
    backgroundColor: BRAND.primary,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  levelText: {
    color: BRAND.white,
    fontSize: 12,
    fontWeight: '700',
  },

  /* Speaky */
  speakySection: {
    alignItems: 'center',
    marginVertical: 16,
  },

  /* Stats */
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 10,
  },
  statBox: {
    flex: 1,
    backgroundColor: BRAND.white,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: BRAND.dark,
  },
  statLabel: {
    fontSize: 11,
    color: BRAND.gray,
    marginTop: 4,
    fontWeight: '500',
  },

  /* Section */
  sectionHeader: {
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: BRAND.dark,
  },

  /* Friends */
  friendsScroll: {
    gap: 16,
    paddingRight: 8,
  },
  friendBubble: {
    alignItems: 'center',
    width: 72,
  },
  friendAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  friendAvatarFallback: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8D5FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  friendAvatarInitial: {
    fontSize: 18,
    fontWeight: '700',
    color: BRAND.primary,
  },
  friendName: {
    fontSize: 11,
    color: BRAND.dark,
    marginTop: 4,
    fontWeight: '500',
    textAlign: 'center',
  },
  friendScore: {
    fontSize: 13,
    fontWeight: '700',
    color: BRAND.primary,
    marginTop: 2,
  },
  emptyFriends: {
    backgroundColor: BRAND.white,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  emptyFriendsText: {
    fontSize: 14,
    color: BRAND.gray,
    textAlign: 'center',
  },
});
