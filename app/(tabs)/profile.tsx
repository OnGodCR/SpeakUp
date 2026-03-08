import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Image,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Button, List, ActivityIndicator } from 'react-native-paper';
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
import { Theme } from '../../constants/colors';

export default function ProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);
  const profile = useUserStore((s) => s.profile);
  const fetchProfile = useUserStore((s) => s.fetchProfile);

  const [refreshing, setRefreshing] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile().catch(() => {});
  }, [fetchProfile]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchProfile().catch(() => {});
    setRefreshing(false);
  }, [fetchProfile]);

  const handleSignOut = async () => {
    setSignOutError(null);
    setSigningOut(true);

    const { error } = await signOut();
    if (error) {
      setSignOutError(error.message || 'Unable to sign out. Please try again.');
    }

    setSigningOut(false);
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
            tintColor={Theme.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
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

        <View style={styles.statsGrid}>
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

        <View style={styles.menuCard}>
          <Text style={styles.menuTitle}>Settings</Text>
          <List.Item
            title="Sign Out from this device"
            description="Alternative sign-out path for QA"
            onPress={handleSignOut}
            disabled={signingOut}
            left={(props) => <List.Icon {...props} icon="logout" />}
            right={() =>
              signingOut ? <ActivityIndicator size={16} color={Theme.muted} /> : null
            }
          />
        </View>

        {signOutError ? <Text style={styles.errorText}>{signOutError}</Text> : null}

        <Button
          mode="outlined"
          onPress={handleSignOut}
          loading={signingOut}
          disabled={signingOut}
          style={styles.signOutButton}
          textColor={Theme.muted}
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
    backgroundColor: Theme.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  profileHeader: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 20,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 2,
    borderColor: Theme.accent,
  },
  avatarFallback: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Theme.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Theme.accent,
  },
  avatarInitial: {
    fontSize: 36,
    fontWeight: '700',
    color: Theme.accent,
  },
  displayName: {
    fontSize: 24,
    fontWeight: '800',
    fontFamily: 'Nunito_800ExtraBold',
    color: Theme.text,
    marginTop: 12,
  },
  email: {
    fontSize: 14,
    color: Theme.muted,
    marginTop: 4,
  },
  levelContainer: {
    marginTop: 12,
  },
  levelBadge: {
    backgroundColor: Theme.primary,
    borderRadius: Theme.radius.pill,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  levelText: {
    color: Theme.text,
    fontSize: 14,
    fontWeight: '700',
  },

  card: {
    backgroundColor: Theme.surface,
    borderRadius: Theme.radius.card,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Theme.cardBorderTint,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Theme.text,
  },
  xpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  xpText: {
    fontSize: 13,
    color: Theme.muted,
    fontWeight: '500',
  },
  xpTrack: {
    height: Theme.progressBarHeight,
    borderRadius: Theme.progressBarHeight / 2,
    backgroundColor: Theme.background,
    overflow: 'hidden',
  },
  xpFill: {
    height: '100%',
    borderRadius: Theme.progressBarHeight / 2,
    backgroundColor: Theme.primary,
  },
  totalXp: {
    fontSize: 12,
    color: Theme.muted,
    marginTop: 8,
    textAlign: 'right',
  },

  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Theme.surface,
    borderRadius: Theme.radius.card,
    paddingVertical: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Theme.cardBorderTint,
  },
  statEmoji: {
    fontSize: 22,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: Theme.text,
    marginTop: 4,
    fontFamily: 'Nunito_800ExtraBold',
  },
  statLabel: {
    fontSize: 12,
    color: Theme.muted,
    marginTop: 4,
    fontWeight: '500',
  },

  shieldCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.accent + '18',
    borderRadius: Theme.radius.card,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Theme.cardBorderTint,
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
    color: Theme.text,
  },
  shieldSubtext: {
    fontSize: 13,
    color: Theme.muted,
    marginTop: 2,
  },

  menuCard: {
    backgroundColor: Theme.surface,
    borderRadius: Theme.radius.card,
    borderWidth: 1,
    borderColor: Theme.cardBorderTint,
    marginBottom: 16,
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Theme.text,
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 13,
    marginBottom: 12,
    fontWeight: '500',
  },

  signOutButton: {
    marginTop: 8,
    borderColor: Theme.muted,
    borderRadius: Theme.radius.button,
  },
});
