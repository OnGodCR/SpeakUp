import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { Theme } from '../constants/Colors';

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
    <View style={styles.card}>
      <View style={styles.content}>
        <View style={styles.categoryPill}>
          <Text style={styles.categoryText}>{category}</Text>
        </View>

        <Text style={styles.topic} numberOfLines={2}>
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
                textColor={Theme.text}
                style={styles.viewButton}
                labelStyle={styles.buttonLabel}
              >
                View Score
              </Button>
            ) : null}
          </View>
        ) : (
          <Button
            mode="contained"
            onPress={onStart}
            buttonColor={Theme.primary}
            textColor={Theme.text}
            style={styles.startButton}
            labelStyle={styles.buttonLabel}
          >
            Start Challenge
          </Button>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 12,
    borderRadius: Theme.radius.card,
    backgroundColor: Theme.surface,
    borderWidth: 1,
    borderColor: Theme.cardBorderTint,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  content: {
    padding: 20,
    gap: 14,
  },
  categoryPill: {
    alignSelf: 'flex-start',
    backgroundColor: Theme.accent + '30',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: Theme.radius.pill,
  },
  categoryText: {
    color: Theme.accent,
    fontSize: 12,
    fontWeight: '700',
  },
  topic: {
    color: Theme.text,
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 28,
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
    color: Theme.muted,
  },
  scoreValue: {
    fontSize: 28,
    fontWeight: '800',
    color: Theme.primary,
  },
  viewButton: {
    borderColor: Theme.muted,
    borderRadius: Theme.radius.button,
  },
  startButton: {
    borderRadius: Theme.radius.button,
    marginTop: 4,
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
});
