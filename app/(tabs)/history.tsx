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
import { Theme } from '../../constants/colors';

function getScoreColor(score: number): string {
  if (score >= 80) return Theme.accent;
  if (score >= 60) return Theme.primary;
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
            { backgroundColor: getScoreColor(item.score) + '25' },
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
            tintColor={Theme.primary}
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
    backgroundColor: Theme.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    fontFamily: 'Nunito_800ExtraBold',
    color: Theme.text,
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

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.surface,
    borderRadius: Theme.radius.card,
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Theme.cardBorderTint,
  },
  cardLeft: {
    flex: 1,
    gap: 4,
  },
  cardDate: {
    fontSize: 12,
    color: Theme.muted,
    fontWeight: '500',
  },
  cardTopic: {
    fontSize: 15,
    fontWeight: '600',
    color: Theme.text,
  },
  scoreBadge: {
    borderRadius: Theme.radius.button,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginLeft: 12,
  },
  scoreBadgeText: {
    fontSize: 18,
    fontWeight: '800',
    fontFamily: 'Nunito_800ExtraBold',
  },
});
