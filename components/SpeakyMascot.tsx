import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Theme } from '../constants/Colors';

/** One frame size from the horizontal sprite sheet (3 poses: friendly, analytical, celebratory) */
const FRAME_WIDTH = 300;
const FRAME_HEIGHT = 400;

export type SpeakyPose = 'friendly' | 'thinking' | 'analytical' | 'celebratory';

const POSE_INDEX: Record<string, number> = {
  friendly: 0,
  thinking: 1,
  analytical: 1,
  celebratory: 2,
};

type Props = {
  pose?: SpeakyPose;
  /** Scale the mascot (1 = one frame size) */
  scale?: number;
};

export default function SpeakyMascot({ pose = 'friendly', scale = 1 }: Props) {
  const index = POSE_INDEX[pose] ?? 0;
  const width = FRAME_WIDTH * scale;
  const height = FRAME_HEIGHT * scale;
  const fullWidth = FRAME_WIDTH * 3 * scale;

  return (
    <View style={[styles.frame, styles.frameBg, { width, height }]}>
      <Image
        source={require('../assets/speakup-mascot-transparent.png')}
        style={[
          styles.sprite,
          {
            width: fullWidth,
            height,
            transform: [{ translateX: -index * width }],
          },
        ]}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    overflow: 'hidden',
  },
  frameBg: {
    backgroundColor: Theme.background,
  },
  sprite: {
    position: 'absolute',
    left: 0,
    top: 0,
    backgroundColor: 'transparent',
  },
});
