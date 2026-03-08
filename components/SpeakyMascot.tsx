import React from 'react';
import { View, StyleSheet } from 'react-native';
import Speaky, { SpeakyPose } from './Speaky';

/**
 * Legacy wrapper around the Speaky component.
 * Maps the old 'friendly'/'analytical'/'celebratory' poses to the new system.
 */
type LegacyPose = 'friendly' | 'thinking' | 'analytical' | 'celebratory';

const POSE_MAP: Record<LegacyPose, SpeakyPose> = {
  friendly: 'waving',
  thinking: 'thinking',
  analytical: 'thinking',
  celebratory: 'celebrating',
};

type Props = {
  pose?: LegacyPose;
  scale?: number;
};

export default function SpeakyMascot({ pose = 'friendly', scale = 1 }: Props) {
  const mappedPose = POSE_MAP[pose] ?? 'waving';
  const size = 150 * scale;

  return (
    <View style={styles.container}>
      <Speaky pose={mappedPose} size={size} showBubble={false} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
