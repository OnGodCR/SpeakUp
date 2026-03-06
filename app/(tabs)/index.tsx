import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Colors, getStreakColor } from '@/constants/Colors';
import { BorderRadius, FontSize, FontWeight, Spacing } from '@/constants/theme';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  // Placeholder data — will be wired to stores later
  const streak = 12;
  const xp = 2450;
  const todayScore = 78;
  const weeklyAvg = 82;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>👤</Text>
        </View>
        <View style={styles.headerStats}>
          <View style={styles.statBadge}>
            <Text style={[styles.flameIcon, { color: getStreakColor(streak) }]}>🔥</Text>
            <Text style={styles.statValue}>{streak}</Text>
          </View>
          <View style={[styles.statBadge, styles.xpBadge]}>
            <Text style={styles.xpText}>{xp} XP</Text>
          </View>
        </View>
      </View>

      {/* Speaky Section */}
      <View style={styles.speakyCard}>
        <Text style={styles.speakyEmoji}>🎙️</Text>
        <View style={styles.speakyBubble}>
          <Text style={styles.speakyMessage}>
            Your {streak}-day streak is on the line. Do it for us. 🫡
          </Text>
        </View>
      </View>

      {/* Daily Challenge Card */}
      <TouchableOpacity style={styles.challengeCard} activeOpacity={0.85}>
        <Text style={styles.challengeLabel}>TODAY'S CHALLENGE</Text>
        <Text style={styles.challengeTopic}>
          "Convince your team to adopt a 4-day work week"
        </Text>
        <Text style={styles.challengeMeta}>Persuasive · 2-3 min</Text>
        <View style={styles.startButton}>
          <Text style={styles.startButtonText}>Start Challenge</Text>
        </View>
      </TouchableOpacity>

      {/* Quick Stats Row */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statCardValue}>{streak}</Text>
          <Text style={styles.statCardLabel}>Day Streak</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statCardValue}>{todayScore}</Text>
          <Text style={styles.statCardLabel}>Today's Score</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statCardValue}>{weeklyAvg}</Text>
          <Text style={styles.statCardLabel}>Weekly Avg</Text>
        </View>
      </View>

      {/* Friend Activity */}
      <Text style={styles.sectionTitle}>Friend Activity</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.friendScroll}>
        {['Alex', 'Jordan', 'Sam', 'Riley'].map((name) => (
          <View key={name} style={styles.friendCard}>
            <View style={styles.friendAvatar}>
              <Text style={styles.friendAvatarText}>{name[0]}</Text>
            </View>
            <Text style={styles.friendName}>{name}</Text>
            <Text style={styles.friendStat}>🔥 {Math.floor(Math.random() * 20 + 3)}</Text>
          </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 24,
  },
  headerStats: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    gap: 4,
  },
  flameIcon: {
    fontSize: 18,
  },
  statValue: {
    color: Colors.textPrimary,
    fontWeight: FontWeight.bold,
    fontSize: FontSize.md,
  },
  xpBadge: {
    backgroundColor: Colors.primary + '20',
  },
  xpText: {
    color: Colors.primary,
    fontWeight: FontWeight.bold,
    fontSize: FontSize.sm,
  },
  speakyCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  speakyEmoji: {
    fontSize: 40,
  },
  speakyBubble: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
  speakyMessage: {
    color: Colors.textPrimary,
    fontSize: FontSize.sm,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  challengeCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
    marginBottom: Spacing.lg,
  },
  challengeLabel: {
    color: Colors.primary,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    letterSpacing: 1.5,
    marginBottom: Spacing.sm,
  },
  challengeTopic: {
    color: Colors.textPrimary,
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    lineHeight: 32,
    marginBottom: Spacing.sm,
  },
  challengeMeta: {
    color: Colors.textMuted,
    fontSize: FontSize.sm,
    marginBottom: Spacing.lg,
  },
  startButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  startButtonText: {
    color: Colors.textPrimary,
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
  },
  statCardValue: {
    color: Colors.textPrimary,
    fontSize: FontSize.xl,
    fontWeight: FontWeight.extrabold,
  },
  statCardLabel: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    marginTop: 4,
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    marginBottom: Spacing.md,
  },
  friendScroll: {
    marginHorizontal: -Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  friendCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
    marginRight: Spacing.sm,
    width: 90,
  },
  friendAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.accent + '30',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
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
  },
  friendStat: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    marginTop: 2,
  },
});
