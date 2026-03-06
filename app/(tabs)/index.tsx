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
import { Theme } from '../../constants/colors';

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
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Theme.primary} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header Row: avatar (teal border), streak center, XP pill right */}
        <View style={styles.headerRow}>
          {avatarUrl ? (
            <View style={styles.avatarWrap}>
              <Image source={{ uri: avatarUrl }} style={styles.avatar} />
            </View>
          ) : (
            <View style={[styles.avatarWrap, styles.avatarFallback]}>
              <Text style={styles.avatarInitial}>{initial}</Text>
            </View>
          )}

          <StreakBadge streak={streak} size="small" />

          <View style={styles.xpPill}>
            <Text style={styles.xpPillText}>Lv.{level}</Text>
          </View>
        </View>

        {/* Speaky in prominent card with speech bubble */}
        <View style={styles.speakyCard}>
          <Speaky message={getGreeting(streak)} mood="happy" size="large" />
        </View>

        {/* Daily Challenge — hero CTA */}
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

        {/* Quick stats: 3 equal cards */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{streak}</Text>
            <Text style={styles.statLabel}>Streak</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>
              {todayScore != null ? todayScore : '—'}
            </Text>
            <Text style={styles.statLabel}>Today</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>—</Text>
            <Text style={styles.statLabel}>Weekly</Text>
          </View>
        </View>

        {/* Friends Activity */}
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
              <View key={friend.id} style={styles.friendChip}>
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
                <View style={styles.friendScoreChip}>
                  <Text style={styles.friendScore}>
                    {friend.today_score != null ? friend.today_score : '—'}
                  </Text>
                </View>
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
    backgroundColor: Theme.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    paddingBottom: 8,
  },
  avatarWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: Theme.accent,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarFallback: {
    backgroundColor: Theme.surface,
  },
  avatarInitial: {
    fontSize: 18,
    fontWeight: '700',
    color: Theme.accent,
  },
  xpPill: {
    backgroundColor: Theme.surface,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: Theme.radius.pill,
    borderWidth: 1,
    borderColor: Theme.cardBorderTint,
  },
  xpPillText: {
    color: Theme.text,
    fontSize: 13,
    fontWeight: '700',
  },

  speakyCard: {
    marginVertical: 16,
    backgroundColor: Theme.surface,
    borderRadius: Theme.radius.card,
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Theme.cardBorderTint,
    alignItems: 'center',
  },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 10,
  },
  statBox: {
    flex: 1,
    backgroundColor: Theme.surface,
    borderRadius: Theme.radius.card,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Theme.cardBorderTint,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: Theme.text,
    fontFamily: 'Nunito_800ExtraBold',
  },
  statLabel: {
    fontSize: 12,
    color: Theme.muted,
    marginTop: 4,
    fontWeight: '600',
  },

  sectionHeader: {
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Theme.text,
    fontFamily: 'Nunito_800ExtraBold',
  },

  friendsScroll: {
    gap: 16,
    paddingRight: 8,
  },
  friendChip: {
    alignItems: 'center',
    width: 80,
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
    backgroundColor: Theme.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Theme.cardBorderTint,
  },
  friendAvatarInitial: {
    fontSize: 18,
    fontWeight: '700',
    color: Theme.accent,
  },
  friendName: {
    fontSize: 12,
    color: Theme.text,
    marginTop: 6,
    fontWeight: '600',
    textAlign: 'center',
  },
  friendScoreChip: {
    marginTop: 4,
    backgroundColor: Theme.surface,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Theme.radius.pill,
  },
  friendScore: {
    fontSize: 14,
    fontWeight: '700',
    color: Theme.primary,
  },
  emptyFriends: {
    backgroundColor: Theme.surface,
    borderRadius: Theme.radius.card,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Theme.cardBorderTint,
  },
  emptyFriendsText: {
    fontSize: 14,
    color: Theme.muted,
    textAlign: 'center',
  },
});
