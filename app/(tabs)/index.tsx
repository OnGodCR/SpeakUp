import React, { useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeInRight,
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Colors, getStreakColor } from '@/constants/Colors';
import { BorderRadius, FontSize, FontWeight, Spacing } from '@/constants/theme';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { StreakFlame } from '@/components/ui/StreakFlame';
import { ProgressBar } from '@/components/ui/ProgressBar';
import Speaky from '@/components/Speaky';
import { getSpeakyHomeMessage, streakBreak, pickRandom } from '@/constants/speakyMessages';
import { useChallengeStore } from '@/stores/challengeStore';
import { useUserStore } from '@/stores/userStore';
import { getXpProgress } from '@/constants/xpTable';

const FRIEND_ACTIVITY = [
  { name: 'Alex', score: 85, streak: 14 },
  { name: 'Jordan', score: 72, streak: 7 },
  { name: 'Sam', score: 91, streak: 23 },
  { name: 'Riley', score: 68, streak: 3 },
  { name: 'Taylor', score: 95, streak: 42 },
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
  const xpProgress = getXpProgress(xp);

  // Button pulse animation for "Start Challenge"
  const btnPulse = useSharedValue(0);
  useEffect(() => {
    btnPulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );
  }, []);

  const btnGlowStyle = useAnimatedStyle(() => ({
    shadowOpacity: interpolate(btnPulse.value, [0, 1], [0.3, 0.7]),
    transform: [{ scale: interpolate(btnPulse.value, [0, 1], [1, 1.02]) }],
  }));

  useEffect(() => {
    fetchProfile().catch(() => {});
    fetchChallenge().catch(() => {});
  }, [fetchProfile, fetchChallenge]);

  // Speaky message & pose logic
  const coachMessage = useMemo(() => {
    if (streak === 0) return pickRandom(streakBreak);
    return getSpeakyHomeMessage(streak, 'witty');
  }, [streak]);

  const mascotPose = useMemo(() => {
    if (isChallengeLoading) return 'thinking' as const;
    if (streak === 0) return 'sad' as const;
    if (streak >= 30) return 'celebrating' as const;
    return 'waving' as const;
  }, [isChallengeLoading, streak]);

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
      refreshControl={
        <RefreshControl
          refreshing={isChallengeLoading || userLoading}
          onRefresh={onRefresh}
          tintColor={Colors.primary}
        />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* Header: avatar, streak flame, level, XP */}
      <Animated.View entering={FadeInDown.duration(350)} style={styles.header}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>
            {profile?.display_name?.[0]?.toUpperCase() ?? '?'}
          </Text>
        </View>

        <View style={styles.headerRight}>
          <Badge bgColor={Colors.surface} style={styles.streakBadge}>
            <StreakFlame days={streak} size={20} />
            <Text style={[styles.streakCount, { color: getStreakColor(streak) }]}>
              {streak}
            </Text>
          </Badge>

          <Badge bgColor={Colors.secondary} style={styles.xpBadge}>
            <Text style={styles.xpText}>Lv.{xpProgress.level}</Text>
          </Badge>

          <Badge bgColor={Colors.teal + '20'} style={styles.xpBadge}>
            <Text style={[styles.xpText, { color: Colors.teal }]}>
              {xp} XP
            </Text>
          </Badge>
        </View>
      </Animated.View>

      {/* XP Progress Bar */}
      <Animated.View entering={FadeInDown.duration(350).delay(40)}>
        <View style={styles.xpProgressRow}>
          <ProgressBar
            progress={xpProgress.progress * 100}
            color={Colors.teal}
            height={6}
          />
          <Text style={styles.xpProgressLabel}>
            {xpProgress.currentXp}/{xpProgress.nextLevelXp} XP to Lv.{xpProgress.level + 1}
          </Text>
        </View>
      </Animated.View>

      {/* Mascot Section with speech bubble */}
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

      {/* Daily Challenge Card (brand-purple gradient) */}
      <Animated.View entering={FadeInDown.duration(350).delay(140)}>
        <LinearGradient
          colors={[Colors.primary, Colors.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.challengeGradient}
        >
          <Text style={styles.challengeLabel}>TODAY'S CHALLENGE</Text>
          <Text style={styles.challengeTopic}>
            {challenge?.topic ?? 'Loading your challenge...'}
          </Text>

          <View style={styles.challengeMetaRow}>
            <View style={styles.categoryPill}>
              <Text style={styles.categoryText}>
                {challenge?.category ?? 'Daily Drill'}
              </Text>
            </View>
            <View style={styles.categoryPill}>
              <Text style={styles.categoryText}>
                {challenge?.difficulty_tier ?? '2-3 min'}
              </Text>
            </View>
          </View>

          <Animated.View style={btnGlowStyle}>
            <TouchableOpacity
              style={[styles.startButton, !challenge && styles.startButtonDisabled]}
              activeOpacity={0.85}
              onPress={handleStartChallenge}
              disabled={!challenge}
            >
              <Text style={styles.startButtonText}>
                {challenge ? 'Start Challenge' : 'Preparing...'}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </LinearGradient>
      </Animated.View>

      {/* Friends Activity horizontal scroll */}
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
          <Animated.View
            key={friend.name}
            entering={FadeInRight.duration(280).delay(250 + i * 70)}
          >
            <Card style={styles.friendChip}>
              <View
                style={[
                  styles.friendAvatar,
                  {
                    borderColor:
                      friend.streak >= 30
                        ? Colors.streak.blue + '60'
                        : friend.streak >= 7
                        ? Colors.streak.red + '60'
                        : Colors.accent + '40',
                  },
                ]}
              >
                <Text style={styles.friendAvatarText}>{friend.name[0]}</Text>
              </View>
              <Text style={styles.friendName}>{friend.name}</Text>
              <View style={styles.friendScoreRow}>
                <StreakFlame days={friend.streak} size={14} />
                <Text style={styles.friendStreak}>{friend.streak}</Text>
              </View>
              <Text style={styles.friendScore}>{friend.score} pts</Text>
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

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: Colors.accent,
  },
  avatarText: {
    fontSize: 22,
    fontWeight: FontWeight.bold,
    color: '#FFFFFF',
  },
  headerRight: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: Spacing.xs + 2,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  streakCount: {
    fontWeight: FontWeight.extrabold,
    fontSize: FontSize.md,
  },
  xpBadge: {
    paddingHorizontal: Spacing.sm + 2,
  },
  xpText: {
    color: Colors.primary,
    fontWeight: FontWeight.bold,
    fontSize: FontSize.xs,
  },

  // XP Progress
  xpProgressRow: {
    gap: 4,
  },
  xpProgressLabel: {
    color: Colors.textMuted,
    fontSize: FontSize.xs - 1,
    fontWeight: FontWeight.medium,
    textAlign: 'right',
  },

  // Mascot Section
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

  // Challenge Card (gradient)
  challengeGradient: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  challengeLabel: {
    color: '#FFFFFF',
    fontSize: FontSize.xs,
    fontWeight: FontWeight.extrabold,
    letterSpacing: 2,
    marginBottom: Spacing.sm,
    opacity: 0.8,
  },
  challengeTopic: {
    color: '#FFFFFF',
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    lineHeight: 31,
    marginBottom: Spacing.md,
  },
  challengeMetaRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  categoryPill: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
  },
  startButton: {
    backgroundColor: Colors.accent,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md + 2,
    alignItems: 'center',
    width: '100%',
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
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

  // Friends Activity
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
    width: 108,
  },
  friendAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
    borderWidth: 2.5,
  },
  friendAvatarText: {
    color: Colors.primary,
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
  friendStreak: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
  },
  friendScore: {
    color: Colors.teal,
    fontSize: FontSize.xs - 1,
    fontWeight: FontWeight.semibold,
    marginTop: 2,
  },
});
