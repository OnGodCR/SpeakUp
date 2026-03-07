import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Animated, {
  FadeInDown,
  FadeInRight,
} from 'react-native-reanimated';
import { Colors, getStreakColor } from '@/constants/Colors';
import { BorderRadius, FontSize, FontWeight, Spacing } from '@/constants/theme';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { StreakFlame } from '@/components/ui/StreakFlame';
import Speaky from '@/components/Speaky';
import { getGreeting } from '@/constants/speakyMessages';


export default function HomeScreen() {
  // Placeholder data — will be wired to stores later
  const streak = 12;
  const xp = 2450;
  const todayScore = 78;
  const weeklyAvg = 82;
  const coachMessage = `${getGreeting(streak)} Also yes, I'm absolutely tracking your consistency.`;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header Row */}
      <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>{'\u{1F464}'}</Text>
        </View>

        <Badge bgColor={Colors.surface} style={styles.streakBadge}>
          <StreakFlame days={streak} size={20} />
          <Text style={[styles.streakCount, { color: getStreakColor(streak) }]}>
            {streak}
          </Text>
        </Badge>

        <Badge bgColor={Colors.primary + '20'} style={styles.xpBadge}>
          <Text style={styles.xpText}>{'\u{26A1}'} {xp} XP</Text>
        </Badge>
      </Animated.View>

      {/* Speaky Section */}
      <Animated.View entering={FadeInDown.duration(400).delay(100)}>
        <Card style={styles.speakyCard} accent>
          <View style={styles.speakyRow}>
            <Speaky pose="waving" size={110} showBubble={false} />
            <View style={styles.speechBubble}>
              <View style={styles.speechArrow} />
              <Text style={styles.speakyMessage}>{coachMessage}</Text>
            </View>
          </View>
        </Card>
      </Animated.View>

      {/* Daily Challenge Card — Hero CTA */}
      <Animated.View entering={FadeInDown.duration(400).delay(200)}>
        <TouchableOpacity activeOpacity={0.85}>
          <Card style={styles.challengeCard}>
            <Text style={styles.challengeLabel}>TODAY'S CHALLENGE</Text>
            <Text style={styles.challengeTopic}>
              "Convince your team to adopt a 4-day work week"
            </Text>
            <Badge
              bgColor={Colors.accent + '20'}
              color={Colors.accent}
              style={styles.categoryPill}
            >
              <Text style={styles.categoryText}>Persuasive</Text>
              <Text style={styles.categoryDot}>{'\u00B7'}</Text>
              <Text style={styles.categoryText}>2-3 min</Text>
            </Badge>
            <TouchableOpacity style={styles.startButton} activeOpacity={0.8}>
              <Text style={styles.startButtonText}>Start Challenge</Text>
            </TouchableOpacity>
          </Card>
        </TouchableOpacity>
      </Animated.View>

      {/* Quick Stats Row */}
      <Animated.View entering={FadeInDown.duration(400).delay(300)} style={styles.statsRow}>
        <Card style={styles.statCard}>
          <StreakFlame days={streak} size={24} />
          <Text style={styles.statCardValue}>{streak}</Text>
          <Text style={styles.statCardLabel}>Day Streak</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statIcon}>{'\u{1F3AF}'}</Text>
          <Text style={styles.statCardValue}>{todayScore}</Text>
          <Text style={styles.statCardLabel}>Today's Score</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statIcon}>{'\u{1F4C8}'}</Text>
          <Text style={styles.statCardValue}>{weeklyAvg}</Text>
          <Text style={styles.statCardLabel}>Weekly Avg</Text>
        </Card>
      </Animated.View>

      {/* Friend Activity */}
      <Animated.View entering={FadeInDown.duration(400).delay(400)}>
        <Text style={styles.sectionTitle}>Friend Activity</Text>
      </Animated.View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.friendScroll}
        contentContainerStyle={styles.friendScrollContent}
      >
        {[
          { name: 'Alex', score: 85, streak: 14 },
          { name: 'Jordan', score: 72, streak: 7 },
          { name: 'Sam', score: 91, streak: 23 },
          { name: 'Riley', score: 68, streak: 3 },
        ].map((friend, i) => (
          <Animated.View
            key={friend.name}
            entering={FadeInRight.duration(300).delay(500 + i * 80)}
          >
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
    paddingTop: 60,
    paddingBottom: 100,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.accent,
  },
  avatarText: {
    fontSize: 22,
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

  // Speaky
  speakyCard: {
    marginBottom: Spacing.lg,
    padding: Spacing.md,
  },
  speakyRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  speechBubble: {
    flex: 1,
    backgroundColor: Colors.background,
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
    borderRightColor: Colors.background,
  },
  speakyMessage: {
    color: Colors.textPrimary,
    fontSize: FontSize.sm,
    fontStyle: 'italic',
    lineHeight: 22,
  },

  // Challenge Card
  challengeCard: {
    marginBottom: Spacing.lg,
    padding: Spacing.lg,
    backgroundColor: Colors.secondary,
    borderColor: Colors.surfaceBorder,
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
    lineHeight: 32,
    marginBottom: Spacing.md,
  },
  categoryPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    gap: 6,
    marginBottom: Spacing.lg,
  },
  categoryText: {
    color: Colors.accent,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },
  categoryDot: {
    color: Colors.accent,
    fontSize: FontSize.sm,
  },
  startButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md + 2,
    alignItems: 'center',
    width: '100%',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  startButtonText: {
    color: Colors.textPrimary,
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    letterSpacing: 0.3,
  },

  // Stats Row
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
  },
  statIcon: {
    fontSize: 24,
  },
  statCardValue: {
    color: Colors.textPrimary,
    fontSize: FontSize.xl,
    fontWeight: FontWeight.black,
    marginTop: Spacing.xs,
  },
  statCardLabel: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    marginTop: 4,
  },

  // Friends
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    marginBottom: Spacing.md,
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
    width: 100,
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
