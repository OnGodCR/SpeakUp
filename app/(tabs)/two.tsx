import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors } from '@/constants/Colors';
import { BorderRadius, FontSize, FontWeight, Spacing } from '@/constants/theme';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { StreakFlame } from '@/components/ui/StreakFlame';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  // Placeholder data
  const streak = 12;
  const totalSpeeches = 47;
  const avgScore = 78;
  const bestScore = 94;
  const level = 8;
  const levelXp = 650;
  const levelXpNeeded = 1000;

  const history = [
    { id: 1, topic: '4-day work week pitch', score: 85, date: 'Today' },
    { id: 2, topic: 'Climate change debate', score: 72, date: 'Yesterday' },
    { id: 3, topic: 'Product launch intro', score: 91, date: '2 days ago' },
    { id: 4, topic: 'Team motivation speech', score: 68, date: '3 days ago' },
    { id: 5, topic: 'Elevator pitch: startup', score: 79, date: '4 days ago' },
  ];

  const friends = [
    { name: 'Alex', streak: 14, done: true },
    { name: 'Jordan', streak: 7, done: false },
    { name: 'Sam', streak: 23, done: true },
    { name: 'Riley', streak: 3, done: false },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Profile Header */}
      <Animated.View entering={FadeInDown.duration(400)} style={styles.profileHeader}>
        <View style={styles.avatarLarge}>
          <Text style={styles.avatarEmoji}>{'\u{1F464}'}</Text>
        </View>
        <Text style={styles.username}>Speaker</Text>
        <View style={styles.levelRow}>
          <Badge bgColor={Colors.primary + '20'}>
            <Text style={styles.levelText}>Level {level}</Text>
          </Badge>
        </View>
        <View style={styles.xpBarContainer}>
          <ProgressBar progress={(levelXp / levelXpNeeded) * 100} color={Colors.primary} height={10} />
          <Text style={styles.xpLabel}>{levelXp} / {levelXpNeeded} XP</Text>
        </View>
      </Animated.View>

      {/* Stats 2x2 Grid */}
      <Animated.View entering={FadeInDown.duration(400).delay(100)} style={styles.statsGrid}>
        <Card style={styles.statGridCard}>
          <StreakFlame days={streak} size={28} />
          <Text style={styles.statGridValue}>{streak}</Text>
          <Text style={styles.statGridLabel}>Day Streak</Text>
        </Card>
        <Card style={styles.statGridCard}>
          <Text style={styles.statGridIcon}>{'\u{1F3A4}'}</Text>
          <Text style={styles.statGridValue}>{totalSpeeches}</Text>
          <Text style={styles.statGridLabel}>Speeches</Text>
        </Card>
        <Card style={styles.statGridCard}>
          <Text style={styles.statGridIcon}>{'\u{1F4CA}'}</Text>
          <Text style={styles.statGridValue}>{avgScore}</Text>
          <Text style={styles.statGridLabel}>Avg Score</Text>
        </Card>
        <Card style={styles.statGridCard}>
          <Text style={styles.statGridIcon}>{'\u{1F3C6}'}</Text>
          <Text style={styles.statGridValue}>{bestScore}</Text>
          <Text style={styles.statGridLabel}>Best Score</Text>
        </Card>
      </Animated.View>

      {/* Speech History */}
      <Animated.View entering={FadeInDown.duration(400).delay(200)}>
        <Text style={styles.sectionTitle}>Speech History</Text>
        {history.map((item) => (
          <Card key={item.id} style={styles.historyRow}>
            <View style={styles.historyInfo}>
              <Text style={styles.historyTopic} numberOfLines={1}>{item.topic}</Text>
              <Text style={styles.historyDate}>{item.date}</Text>
            </View>
            <Badge
              bgColor={
                item.score >= 85
                  ? Colors.success + '20'
                  : item.score >= 70
                  ? Colors.primary + '20'
                  : Colors.error + '20'
              }
            >
              <Text
                style={[
                  styles.historyScore,
                  {
                    color:
                      item.score >= 85
                        ? Colors.success
                        : item.score >= 70
                        ? Colors.primary
                        : Colors.error,
                  },
                ]}
              >
                {item.score}
              </Text>
            </Badge>
          </Card>
        ))}
      </Animated.View>

      {/* Friends List */}
      <Animated.View entering={FadeInDown.duration(400).delay(300)}>
        <Text style={styles.sectionTitle}>Friends</Text>
        {friends.map((friend) => (
          <Card key={friend.name} style={styles.friendRow}>
            <View style={styles.friendAvatar}>
              <Text style={styles.friendAvatarText}>{friend.name[0]}</Text>
            </View>
            <View style={styles.friendInfo}>
              <Text style={styles.friendName}>{friend.name}</Text>
              <View style={styles.friendStreakRow}>
                <StreakFlame days={friend.streak} size={14} />
                <Text style={styles.friendStreakText}>{friend.streak} days</Text>
              </View>
            </View>
            <Badge
              bgColor={friend.done ? Colors.success + '20' : Colors.warning + '20'}
            >
              <Text
                style={{
                  color: friend.done ? Colors.success : Colors.warning,
                  fontSize: FontSize.xs,
                  fontWeight: FontWeight.bold,
                }}
              >
                {friend.done ? 'Done' : 'Pending'}
              </Text>
            </Badge>
          </Card>
        ))}
      </Animated.View>
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

  // Profile Header
  profileHeader: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.accent,
    marginBottom: Spacing.sm,
  },
  avatarEmoji: {
    fontSize: 38,
  },
  username: {
    color: Colors.textPrimary,
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    marginBottom: Spacing.xs,
  },
  levelRow: {
    marginBottom: Spacing.md,
  },
  levelText: {
    color: Colors.primary,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
  },
  xpBarContainer: {
    width: '100%',
    maxWidth: 240,
  },
  xpLabel: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },

  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  statGridCard: {
    width: (width - Spacing.lg * 2 - Spacing.sm) / 2 - 1,
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  statGridIcon: {
    fontSize: 28,
  },
  statGridValue: {
    color: Colors.textPrimary,
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.black,
    marginTop: Spacing.xs,
  },
  statGridLabel: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    marginTop: 4,
  },

  // Section Title
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    marginBottom: Spacing.md,
    marginTop: Spacing.md,
  },

  // History
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    paddingVertical: Spacing.md,
  },
  historyInfo: {
    flex: 1,
    marginRight: Spacing.md,
  },
  historyTopic: {
    color: Colors.textPrimary,
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
  historyDate: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    marginTop: 2,
  },
  historyScore: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.extrabold,
  },

  // Friends
  friendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    paddingVertical: Spacing.md,
  },
  friendAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.accent + '25',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.accent + '40',
    marginRight: Spacing.md,
  },
  friendAvatarText: {
    color: Colors.accent,
    fontWeight: FontWeight.bold,
    fontSize: FontSize.md,
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    color: Colors.textPrimary,
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
  friendStreakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  friendStreakText: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
  },
});
