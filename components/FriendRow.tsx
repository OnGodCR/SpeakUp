import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Text } from 'react-native-paper';
import StreakBadge from './StreakBadge';
import { Theme } from '../constants/colors';

type Props = {
  name: string;
  avatarUrl?: string;
  streak: number;
  level: number;
  todayScore?: number | null;
  onPress: () => void;
};

export default function FriendRow({
  name,
  avatarUrl,
  streak,
  level,
  todayScore,
  onPress,
}: Props) {
  const initial = name.charAt(0).toUpperCase();
  const isDone = todayScore != null;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {avatarUrl ? (
        <Image source={{ uri: avatarUrl }} style={styles.avatar} />
      ) : (
        <View style={styles.avatarFallback}>
          <Text style={styles.avatarInitial}>{initial}</Text>
        </View>
      )}

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        <View style={styles.metaRow}>
          <StreakBadge streak={streak} size="small" />
          <Text style={styles.level}>Lv. {level}</Text>
        </View>
      </View>

      <View style={styles.chipWrap}>
        <View
          style={[
            styles.statusChip,
            isDone ? styles.chipDone : styles.chipPending,
          ]}
        >
          <Text
            style={[
              styles.statusChipText,
              isDone ? styles.chipDoneText : styles.chipPendingText,
            ]}
          >
            {isDone ? 'Done' : 'Pending'}
          </Text>
        </View>
        {isDone ? (
          <Text style={styles.todayScore}>{todayScore}</Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 18,
    backgroundColor: Theme.surface,
    borderRadius: Theme.radius.card,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Theme.cardBorderTint,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  avatarFallback: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Theme.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Theme.cardBorderTint,
  },
  avatarInitial: {
    fontSize: 18,
    fontWeight: '700',
    color: Theme.accent,
  },
  info: {
    flex: 1,
    marginLeft: 14,
    gap: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: Theme.text,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  level: {
    fontSize: 12,
    color: Theme.muted,
    fontWeight: '500',
  },
  chipWrap: {
    alignItems: 'flex-end',
    gap: 4,
  },
  statusChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Theme.radius.pill,
  },
  chipDone: {
    backgroundColor: Theme.accent + '30',
  },
  chipPending: {
    backgroundColor: Theme.muted + '25',
  },
  statusChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  chipDoneText: {
    color: Theme.accent,
  },
  chipPendingText: {
    color: Theme.muted,
  },
  todayScore: {
    fontSize: 18,
    fontWeight: '800',
    color: Theme.primary,
    fontFamily: 'Nunito_800ExtraBold',
  },
});
