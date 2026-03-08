import React, { useState } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Timer from '../../components/Timer';
import { useChallengeStore } from '../../stores/challengeStore';
import { Theme } from '../../constants/Colors';

const PREP_SECONDS = 300; // 5 minutes

export default function PrepScreen() {
  const router = useRouter();
  const challenge = useChallengeStore((s) => s.challenge);
  const [notes, setNotes] = useState('');

  const goToRecord = () => {
    router.push('/challenge/record');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topicContainer}>
        <Text style={styles.topicLabel}>Today's Topic</Text>
        <Text style={styles.topicText}>
          {challenge?.topic ?? 'Loading topic...'}
        </Text>
        {challenge?.hint ? (
          <Text style={styles.hintText}>Hint: {challenge.hint}</Text>
        ) : null}
      </View>

      <View style={styles.timerContainer}>
        <Text style={styles.timerLabel}>Prep Time Remaining</Text>
        <Timer
          totalSeconds={PREP_SECONDS}
          onComplete={goToRecord}
          size="large"
        />
      </View>

      <View style={styles.notesCard}>
        <Text style={styles.notesLabel}>Jot down your thoughts</Text>
        <TextInput
          style={styles.notesInput}
          placeholder="Key points, structure ideas, opening line..."
          placeholderTextColor={Theme.muted}
          multiline
          textAlignVertical="top"
          value={notes}
          onChangeText={setNotes}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          mode="outlined"
          onPress={goToRecord}
          textColor={Theme.text}
          style={styles.skipButton}
          labelStyle={styles.buttonLabel}
        >
          Skip Prep
        </Button>
        <Button
          mode="contained"
          onPress={goToRecord}
          buttonColor={Theme.primary}
          textColor={Theme.text}
          style={styles.readyButton}
          labelStyle={styles.buttonLabel}
        >
          I'm Ready to Speak
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.background,
    paddingHorizontal: 24,
  },
  topicContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  topicLabel: {
    fontSize: 12,
    color: Theme.muted,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  topicText: {
    fontSize: 22,
    fontWeight: '700',
    fontFamily: 'Nunito_800ExtraBold',
    color: Theme.text,
    textAlign: 'center',
    lineHeight: 30,
  },
  hintText: {
    fontSize: 14,
    color: Theme.accent,
    marginTop: 8,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  timerContainer: {
    alignItems: 'center',
    marginTop: 32,
  },
  timerLabel: {
    fontSize: 12,
    color: Theme.muted,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  notesCard: {
    flex: 1,
    marginTop: 28,
    backgroundColor: Theme.surface,
    borderRadius: Theme.radius.card,
    padding: 16,
    borderWidth: 1,
    borderColor: Theme.cardBorderTint,
  },
  notesLabel: {
    fontSize: 12,
    color: Theme.muted,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  notesInput: {
    flex: 1,
    backgroundColor: 'transparent',
    color: Theme.text,
    fontSize: 16,
    lineHeight: 24,
    paddingVertical: 0,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 20,
  },
  skipButton: {
    flex: 1,
    borderColor: Theme.muted,
    borderRadius: Theme.radius.button,
  },
  readyButton: {
    flex: 2,
    borderRadius: Theme.radius.button,
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 15,
    fontWeight: '700',
    paddingVertical: 4,
  },
});
