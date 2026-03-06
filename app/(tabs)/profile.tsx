import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Image,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Button } from 'react-native-paper';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

import { useAuthStore } from '../../stores/authStore';
import { useUserStore } from '../../stores/userStore';
import { getXpProgress } from '../../constants/xpTable';
import StreakBadge from '../../components/StreakBadge';

const BRAND = {
  primary: '#6C3CE1',
  accent: '#FF6B35',
  dark: '#1A1A2E',
  gray: '#6B7280',
  background: '#F8F9FA',
  white: '#FFFFFF',
};

export default function ProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);
  const profile = useUserStore((s) => s.profile);
  const fetchProfile = useUserStore((s) => s.fetchProfile);

  const [refreshing, setRefreshing] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    fetchProfile().catch(() => {});
  }, [fetchProfile]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchProfile().catch(() => {});
    setRefreshing(false);
  }, [fetchProfile]);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
    } catch {
      setSigningOut(false);
    }
  };

  const displayName =
    profile?.display_name ?? user?.user_metadata?.display_name ?? 'Speaker';
  const avatarUrl = profile?.avatar_url ?? null;
  const initial = displayName.charAt(0).toUpperCase();
  const streak = profile?.current_streak ?? 0;
  const longestStreak = profile?.longest_streak ?? 0;
  const totalXp = profile?.total_xp ?? 0;

  const xpProgress = getXpProgress(totalXp);

  const xpBarWidth = useSharedValue(0);

  useEffect(() => {
    xpBarWidth.value = withTiming(xpProgress.progress * 100, {
      duration: 900,
      easing: Easing.out(Easing.cubic),
    });
  }, [xpProgress.progress]);

  const xpFillStyle = useAnimatedStyle(() => ({
    width: `${xpBarWidth.value}%`,
  }));

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={BRAND.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarInitial}>{initial}</Text>
            </View>
          )}
          <Text style={styles.displayName}>{displayName}</Text>
          <Text style={styles.email}>{user?.email ?? ''}</Text>

          <View style={styles.levelContainer}>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>Level {xpProgress.level}</Text>
            </View>
          </View>
        </View>

        {/* XP Progress */}
        <View style={styles.card}>
          <View style={styles.xpHeader}>
            <Text style={styles.cardTitle}>Experience Points</Text>
            <Text style={styles.xpText}>
              {xpProgress.currentXp} / {xpProgress.nextLevelXp} XP
            </Text>
          </View>
          <View style={styles.xpTrack}>
            <Animated.View style={[styles.xpFill, xpFillStyle]} />
          </View>
          <Text style={styles.totalXp}>{totalXp} total XP</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <StreakBadge streak={streak} size="small" />
            <Text style={styles.statValue}>{streak}</Text>
            <Text style={styles.statLabel}>Current Streak</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statEmoji}>{'🏆'}</Text>
            <Text style={styles.statValue}>{longestStreak}</Text>
            <Text style={styles.statLabel}>Best Streak</Text>
          </View>
        </View>

        {/* Streak Shield */}
        {profile?.streak_shield_available ? (
          <View style={styles.shieldCard}>
            <Text style={styles.shieldEmoji}>{'🛡️'}</Text>
            <View style={styles.shieldInfo}>
              <Text style={styles.shieldTitle}>Streak Shield Available</Text>
              <Text style={styles.shieldSubtext}>
                Miss a day without losing your streak
              </Text>
            </View>
          </View>
        ) : null}

        {/* Sign Out */}
        <Button
          mode="outlined"
          onPress={handleSignOut}
          loading={signingOut}
          disabled={signingOut}
          style={styles.signOutButton}
          textColor={BRAND.gray}
        >
          Sign Out
        </Button>
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
    paddingBottom: 40,
  },

  /* Header */
  profileHeader: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 20,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
  },
  avatarFallback: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#E8D5FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontSize: 36,
    fontWeight: '700',
    color: BRAND.primary,
  },
  displayName: {
    fontSize: 24,
    fontWeight: '800',
    color: BRAND.dark,
    marginTop: 12,
  },
  email: {
    fontSize: 14,
    color: BRAND.gray,
    marginTop: 4,
  },
  levelContainer: {
    marginTop: 12,
  },
  levelBadge: {
    backgroundColor: BRAND.primary,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  levelText: {
    color: BRAND.white,
    fontSize: 14,
    fontWeight: '700',
  },

  /* Card */
  card: {
    backgroundColor: BRAND.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: BRAND.dark,
  },
  xpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  xpText: {
    fontSize: 13,
    color: BRAND.gray,
    fontWeight: '500',
  },
  xpTrack: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E5E7EB',
    overflow: 'hidden',
  },
  xpFill: {
    height: '100%',
    borderRadius: 5,
    backgroundColor: BRAND.primary,
  },
  totalXp: {
    fontSize: 12,
    color: BRAND.gray,
    marginTop: 8,
    textAlign: 'right',
  },

  /* Stats */
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: BRAND.white,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  statEmoji: {
    fontSize: 20,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: BRAND.dark,
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: BRAND.gray,
    marginTop: 4,
    fontWeight: '500',
  },

  /* Shield */
  shieldCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  shieldEmoji: {
    fontSize: 28,
    marginRight: 12,
  },
  shieldInfo: {
    flex: 1,
  },
  shieldTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: BRAND.dark,
  },
  shieldSubtext: {
    fontSize: 13,
    color: BRAND.gray,
    marginTop: 2,
  },

  /* Sign Out */
  signOutButton: {
    marginTop: 8,
    borderColor: '#E5E7EB',
    borderRadius: 12,
  },
});
