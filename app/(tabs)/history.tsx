import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from 'react-native-paper';

import Speaky from '../../components/Speaky';
import { useUserStore, SpeechHistory } from '../../stores/userStore';

const BRAND = {
  primary: '#6C3CE1',
  accent: '#FF6B35',
  dark: '#1A1A2E',
  gray: '#6B7280',
  background: '#F8F9FA',
  white: '#FFFFFF',
};

function getScoreColor(score: number): string {
  if (score >= 80) return '#10B981';
  if (score >= 60) return BRAND.accent;
  return '#EF4444';
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function HistoryScreen() {
  const speeches = useUserStore((s) => s.speeches);
  const isLoading = useUserStore((s) => s.isLoading);
  const fetchSpeechHistory = useUserStore((s) => s.fetchSpeechHistory);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchSpeechHistory().catch(() => {});
  }, [fetchSpeechHistory]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchSpeechHistory();
    } catch {
      // silently handle
    }
    setRefreshing(false);
  }, [fetchSpeechHistory]);

  const handleItemPress = (item: SpeechHistory) => {
    Alert.alert(
      'Speech Score',
      `Topic: ${item.topic_snippet}\n\nOverall: ${item.score}\nClarity: ${item.clarity_score}\nConfidence: ${item.confidence_score}\nGrammar: ${item.grammar_score}\nFiller words: ${item.filler_word_count}`,
    );
  };

  const renderItem = ({ item }: { item: SpeechHistory }) => {
    const truncatedTopic =
      item.topic_snippet.length > 50
        ? item.topic_snippet.substring(0, 50) + '...'
        : item.topic_snippet;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => handleItemPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.cardLeft}>
          <Text style={styles.cardDate}>{formatDate(item.date)}</Text>
          <Text style={styles.cardTopic} numberOfLines={1}>
            {truncatedTopic}
          </Text>
        </View>
        <View
          style={[
            styles.scoreBadge,
            { backgroundColor: getScoreColor(item.score) + '18' },
          ]}
        >
          <Text
            style={[styles.scoreBadgeText, { color: getScoreColor(item.score) }]}
          >
            {item.score}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => {
    if (isLoading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Speaky
          message="No speeches yet. Complete your first challenge!"
          mood="thinking"
          size="large"
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Speech History</Text>
      </View>

      <FlatList
        data={speeches}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={
          speeches.length === 0 ? styles.emptyList : styles.listContent
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
    paddingBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: BRAND.dark,
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

  /* Card */
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BRAND.white,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  cardLeft: {
    flex: 1,
    gap: 4,
  },
  cardDate: {
    fontSize: 12,
    color: BRAND.gray,
    fontWeight: '500',
  },
  cardTopic: {
    fontSize: 15,
    fontWeight: '600',
    color: BRAND.dark,
  },
  scoreBadge: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginLeft: 12,
  },
  scoreBadgeText: {
    fontSize: 18,
    fontWeight: '800',
  },
});
