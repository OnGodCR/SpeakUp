import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Button, Chip } from 'react-native-paper';

const BRAND = {
  primary: '#6C3CE1',
  accent: '#FF6B35',
  dark: '#1A1A2E',
  gray: '#6B7280',
};

type Props = {
  topic: string;
  category: string;
  isCompleted: boolean;
  score?: number;
  onStart: () => void;
  onViewScore?: () => void;
};

export default function ChallengeCard({
  topic,
  category,
  isCompleted,
  score,
  onStart,
  onViewScore,
}: Props) {
  return (
    <Card style={styles.card} mode="elevated">
      <Card.Content style={styles.content}>
        <Chip
          style={styles.categoryChip}
          textStyle={styles.categoryText}
          compact
        >
          {category}
        </Chip>

        <Text variant="titleMedium" style={styles.topic}>
          {topic}
        </Text>

        {isCompleted ? (
          <View style={styles.completedRow}>
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreLabel}>Score</Text>
              <Text style={styles.scoreValue}>{score ?? '—'}</Text>
            </View>
            {onViewScore ? (
              <Button
                mode="outlined"
                onPress={onViewScore}
                textColor={BRAND.primary}
                style={styles.viewButton}
              >
                View Score
              </Button>
            ) : null}
          </View>
        ) : (
          <Button
            mode="contained"
            onPress={onStart}
            buttonColor={BRAND.primary}
            textColor="#FFFFFF"
            style={styles.startButton}
          >
            Start Challenge
          </Button>
        )}
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
  },
  content: {
    gap: 12,
  },
  categoryChip: {
    alignSelf: 'flex-start',
    backgroundColor: '#F3F0FF',
  },
  categoryText: {
    color: BRAND.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  topic: {
    color: BRAND.dark,
    fontWeight: '700',
    lineHeight: 24,
  },
  completedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  scoreContainer: {
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 12,
    color: BRAND.gray,
  },
  scoreValue: {
    fontSize: 28,
    fontWeight: '800',
    color: BRAND.primary,
  },
  viewButton: {
    borderColor: BRAND.primary,
    borderRadius: 24,
  },
  startButton: {
    borderRadius: 24,
    marginTop: 4,
  },
});
