import React, { useState } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Timer from '../../components/Timer';
import { useChallengeStore } from '../../stores/challengeStore';

const COLORS = {
  primary: '#6C3CE1',
  accent: '#FF6B35',
  dark: '#1A1A2E',
  gray: '#6B7280',
  background: '#F8F9FA',
  white: '#FFFFFF',
};

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
      {/* Topic */}
      <View style={styles.topicContainer}>
        <Text style={styles.topicLabel}>Today's Topic</Text>
        <Text style={styles.topicText}>
          {challenge?.topic ?? 'Loading topic...'}
        </Text>
        {challenge?.hint ? (
          <Text style={styles.hintText}>Hint: {challenge.hint}</Text>
        ) : null}
      </View>

      {/* Timer */}
      <View style={styles.timerContainer}>
        <Text style={styles.timerLabel}>Prep Time Remaining</Text>
        <Timer
          totalSeconds={PREP_SECONDS}
          onComplete={goToRecord}
          size="large"
        />
      </View>

      {/* Notes */}
      <View style={styles.notesContainer}>
        <Text style={styles.notesLabel}>Jot down your thoughts</Text>
        <TextInput
          style={styles.notesInput}
          placeholder="Key points, structure ideas, opening line..."
          placeholderTextColor={COLORS.gray}
          multiline
          textAlignVertical="top"
          value={notes}
          onChangeText={setNotes}
        />
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <Button
          mode="outlined"
          onPress={goToRecord}
          textColor={COLORS.white}
          style={styles.skipButton}
          labelStyle={styles.buttonLabel}
        >
          Skip Prep
        </Button>
        <Button
          mode="contained"
          onPress={goToRecord}
          buttonColor={COLORS.primary}
          textColor={COLORS.white}
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
    backgroundColor: COLORS.dark,
    paddingHorizontal: 24,
  },
  topicContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  topicLabel: {
    fontSize: 14,
    color: COLORS.gray,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  topicText: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.white,
    textAlign: 'center',
    lineHeight: 30,
  },
  hintText: {
    fontSize: 14,
    color: COLORS.accent,
    marginTop: 8,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  timerContainer: {
    alignItems: 'center',
    marginTop: 32,
  },
  timerLabel: {
    fontSize: 13,
    color: COLORS.gray,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  notesContainer: {
    flex: 1,
    marginTop: 28,
  },
  notesLabel: {
    fontSize: 13,
    color: COLORS.gray,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  notesInput: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    padding: 16,
    color: COLORS.white,
    fontSize: 16,
    lineHeight: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 20,
  },
  skipButton: {
    flex: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 12,
  },
  readyButton: {
    flex: 2,
    borderRadius: 12,
  },
  buttonLabel: {
    fontSize: 15,
    fontWeight: '600',
    paddingVertical: 4,
  },
});
