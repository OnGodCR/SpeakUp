import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Text } from 'react-native-paper';
import StreakBadge from './StreakBadge';

const BRAND = {
  primary: '#6C3CE1',
  accent: '#FF6B35',
  dark: '#1A1A2E',
  gray: '#6B7280',
};

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

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Avatar */}
      {avatarUrl ? (
        <Image source={{ uri: avatarUrl }} style={styles.avatar} />
      ) : (
        <View style={styles.avatarFallback}>
          <Text style={styles.avatarInitial}>{initial}</Text>
        </View>
      )}

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        <View style={styles.metaRow}>
          <StreakBadge streak={streak} size="small" />
          <Text style={styles.level}>Lv. {level}</Text>
        </View>
      </View>

      {/* Today's score */}
      <View style={styles.scoreSection}>
        {todayScore != null ? (
          <Text style={styles.todayScore}>{todayScore}</Text>
        ) : (
          <Text style={styles.notYet}>Not yet</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginVertical: 4,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  avatarFallback: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E8D5FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontSize: 18,
    fontWeight: '700',
    color: BRAND.primary,
  },
  info: {
    flex: 1,
    marginLeft: 12,
    gap: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: BRAND.dark,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  level: {
    fontSize: 12,
    color: BRAND.gray,
    fontWeight: '500',
  },
  scoreSection: {
    alignItems: 'flex-end',
    minWidth: 50,
  },
  todayScore: {
    fontSize: 22,
    fontWeight: '800',
    color: BRAND.primary,
  },
  notYet: {
    fontSize: 13,
    color: BRAND.gray,
    fontStyle: 'italic',
  },
});
