import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { Colors, getStreakColor } from '@/constants/Colors';
import { BorderRadius, FontSize, FontWeight, Spacing } from '@/constants/theme';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { StreakFlame } from '@/components/ui/StreakFlame';
import Speaky from '@/components/Speaky';
import { getSpeakyHomeMessage } from '@/constants/speakyMessages';
import { useChallengeStore } from '@/stores/challengeStore';
import { useUserStore } from '@/stores/userStore';

const FRIEND_ACTIVITY = [
  { name: 'Alex', score: 85, streak: 14 },
  { name: 'Jordan', score: 72, streak: 7 },
  { name: 'Sam', score: 91, streak: 23 },
  { name: 'Riley', score: 68, streak: 3 },
];

export default function HomeScreen() {
  const router = useRouter();

  const challenge = useChallengeStore((s) => s.challenge);
  const isChallengeLoading = useChallengeStore((s) => s.isLoading);
  const fetchChallenge = useChallengeStore((s) => s.fetchChallenge);

  const profile = useUserStore((s) => s.profile);
  const userLoading = useUserStore((s) => s.isLoading);
  const fetchProfile = useUserStore((s) => s.fetchProfile);

  const streak = profile?.current_streak ?? 0;
  const xp = profile?.total_xp ?? 0;

  useEffect(() => {
    fetchProfile().catch(() => {});
    fetchChallenge().catch(() => {});
  }, [fetchProfile, fetchChallenge]);

  const coachMessage = useMemo(() => getSpeakyHomeMessage(streak, 'sarcastic'), [streak]);
  const mascotPose = isChallengeLoading ? 'thinking' : 'waving';

  const handleStartChallenge = () => {
    if (!challenge) return;
    router.push('/challenge/prep');
  };

  const onRefresh = async () => {
    await Promise.allSettled([fetchProfile(), fetchChallenge()]);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={isChallengeLoading || userLoading} onRefresh={onRefresh} />}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View entering={FadeInDown.duration(350)} style={styles.header}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>🎯</Text>
        </View>

        <Badge bgColor={Colors.surface} style={styles.streakBadge}>
          <StreakFlame days={streak} size={20} />
          <Text style={[styles.streakCount, { color: getStreakColor(streak) }]}>{streak}</Text>
        </Badge>

        <Badge bgColor={Colors.secondary} style={styles.xpBadge}>
          <Text style={styles.xpText}>⚡ {xp} XP</Text>
        </Badge>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(350).delay(80)}>
        <Card style={styles.speakyCard} accent>
          <View style={styles.speakyRow}>
            <Speaky pose={mascotPose} size={114} showBubble={false} />
            <View style={styles.speechBubble}>
              <View style={styles.speechArrow} />
              <Text style={styles.speakyMessage}>{coachMessage}</Text>
            </View>
          </View>
        </Card>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(350).delay(140)}>
        <Card style={styles.challengeCard}>
          <Text style={styles.challengeLabel}>TODAY'S CHALLENGE</Text>
          <Text style={styles.challengeTopic}>{challenge?.topic ?? 'Loading your challenge...'}</Text>

          <Badge bgColor={Colors.secondary} color={Colors.primary} style={styles.categoryPill}>
            <Text style={styles.categoryText}>{challenge?.category ?? 'Daily Drill'}</Text>
            <Text style={styles.categoryDot}>·</Text>
            <Text style={styles.categoryText}>{challenge?.difficulty_tier ?? '2-3 min'}</Text>
          </Badge>

          <TouchableOpacity
            style={[styles.startButton, !challenge && styles.startButtonDisabled]}
            activeOpacity={0.85}
            onPress={handleStartChallenge}
            disabled={!challenge}
          >
            <Text style={styles.startButtonText}>{challenge ? 'Start Challenge' : 'Preparing...'}</Text>
          </TouchableOpacity>
        </Card>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(350).delay(200)}>
        <Text style={styles.sectionTitle}>Friends Activity</Text>
      </Animated.View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.friendScroll}
        contentContainerStyle={styles.friendScrollContent}
      >
        {FRIEND_ACTIVITY.map((friend, i) => (
          <Animated.View key={friend.name} entering={FadeInRight.duration(280).delay(250 + i * 70)}>
            <Card style={styles.friendChip}>
              <View style={styles.friendAvatar}>
                <Text style={styles.friendAvatarText}>{friend.name[0]}</Text>
              </View>
              <Text style={styles.friendName}>{friend.name}</Text>
              <View style={styles.friendScoreRow}>
                <StreakFlame days={friend.streak} size={14} />
                <Text style={styles.friendScore}>{friend.score}</Text>
              </View>
            </Card>
          </Animated.View>
        ))}
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingTop: 58,
    paddingBottom: 120,
    gap: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.primary + '40',
  },
  avatarText: {
    fontSize: 23,
  },
  streakBadge: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  streakCount: {
    fontWeight: FontWeight.extrabold,
    fontSize: FontSize.md,
  },
  xpBadge: {
    marginLeft: Spacing.sm,
  },
  xpText: {
    color: Colors.primary,
    fontWeight: FontWeight.bold,
    fontSize: FontSize.sm,
  },
  speakyCard: {
    padding: Spacing.md,
  },
  speakyRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  speechBubble: {
    flex: 1,
    backgroundColor: Colors.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    position: 'relative',
  },
  speechArrow: {
    position: 'absolute',
    left: -6,
    top: 14,
    width: 0,
    height: 0,
    borderTopWidth: 6,
    borderBottomWidth: 6,
    borderRightWidth: 8,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: Colors.secondary,
  },
  speakyMessage: {
    color: Colors.textPrimary,
    fontSize: FontSize.sm,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  challengeCard: {
    padding: Spacing.lg,
  },
  challengeLabel: {
    color: Colors.primary,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.extrabold,
    letterSpacing: 2,
    marginBottom: Spacing.sm,
  },
  challengeTopic: {
    color: Colors.textPrimary,
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    lineHeight: 31,
    marginBottom: Spacing.md,
  },
  categoryPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    gap: 6,
    marginBottom: Spacing.lg,
  },
  categoryText: {
    color: Colors.primary,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },
  categoryDot: {
    color: Colors.primary,
    fontSize: FontSize.sm,
  },
  startButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md + 2,
    alignItems: 'center',
    width: '100%',
  },
  startButtonDisabled: {
    opacity: 0.6,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    letterSpacing: 0.3,
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    marginBottom: Spacing.xs,
  },
  friendScroll: {
    marginHorizontal: -Spacing.lg,
  },
  friendScrollContent: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  friendChip: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    width: 102,
  },
  friendAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.accent + '25',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
    borderWidth: 2,
    borderColor: Colors.accent + '40',
  },
  friendAvatarText: {
    color: Colors.accent,
    fontWeight: FontWeight.bold,
    fontSize: FontSize.md,
  },
  friendName: {
    color: Colors.textPrimary,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    marginBottom: 2,
  },
  friendScoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  friendScore: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
  },
});
