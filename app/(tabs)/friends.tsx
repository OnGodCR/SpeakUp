import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, TextInput, Button } from 'react-native-paper';

import FriendRow from '../../components/FriendRow';
import Speaky from '../../components/Speaky';
import { fetchFriendsActivity, FriendActivity } from '../../lib/api';

const BRAND = {
  primary: '#6C3CE1',
  accent: '#FF6B35',
  dark: '#1A1A2E',
  gray: '#6B7280',
  background: '#F8F9FA',
  white: '#FFFFFF',
};

export default function FriendsScreen() {
  const [friends, setFriends] = useState<FriendActivity[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const loadFriends = useCallback(async () => {
    try {
      const data = await fetchFriendsActivity();
      setFriends(data);
    } catch {
      // silently handle
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFriends();
  }, [loadFriends]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadFriends();
    setRefreshing(false);
  }, [loadFriends]);

  const filtered = searchQuery.trim()
    ? friends.filter((f) =>
        f.display_name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : friends;

  const renderItem = ({ item }: { item: FriendActivity }) => (
    <FriendRow
      name={item.display_name}
      avatarUrl={item.avatar_url ?? undefined}
      streak={item.current_streak}
      level={item.level}
      todayScore={item.today_score}
      onPress={() => {}}
    />
  );

  const renderEmpty = () => {
    if (isLoading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Speaky
          message="No friends yet! Add some friends to see their progress and stay motivated together."
          mood="thinking"
          size="large"
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Friends</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search friends..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          mode="outlined"
          dense
          left={<TextInput.Icon icon="magnify" />}
          style={styles.searchInput}
          outlineColor="#E5E7EB"
          activeOutlineColor={BRAND.primary}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={
          filtered.length === 0 ? styles.emptyList : styles.listContent
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={BRAND.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BRAND.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: BRAND.dark,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  searchInput: {
    backgroundColor: BRAND.white,
    fontSize: 14,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 40,
  },
});
