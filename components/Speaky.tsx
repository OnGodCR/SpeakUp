import React, { useEffect, useMemo } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Theme } from '../constants/colors';
import { Text } from 'react-native-paper';

export type SpeakyPose = 'waving' | 'thinking' | 'celebrating' | 'sad';

const POSE_MOOD_MAP: Record<'happy' | 'thinking' | 'sad' | 'excited', SpeakyPose> = {
  happy: 'waving',
  thinking: 'thinking',
  sad: 'sad',
  excited: 'celebrating',
};

type LegacyMood = 'happy' | 'thinking' | 'sad' | 'excited';

type SpeakyProps = {
  pose?: SpeakyPose;
  mood?: LegacyMood;
  size?: number | 'small' | 'large';
  message?: string;
  style?: StyleProp<ViewStyle>;
  showBubble?: boolean;
};

const AnimatedView = Animated.createAnimatedComponent(View);

export default function Speaky({
  pose,
  mood,
  size = 150,
  message,
  style,
  showBubble = true,
}: SpeakyProps) {
  const resolvedPose = pose ?? (mood ? POSE_MOOD_MAP[mood] : 'waving');
  const resolvedSize = typeof size === 'number' ? size : size === 'small' ? 96 : 150;

  const transition = useSharedValue(0);
  const idle = useSharedValue(0);

  useEffect(() => {
    transition.value = 0;
    transition.value = withTiming(1, {
      duration: 320,
      easing: Easing.out(Easing.cubic),
    });
  }, [resolvedPose]);

  useEffect(() => {
    idle.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 900, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 900, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const poseRotation =
      resolvedPose === 'waving' ? interpolate(idle.value, [0, 1], [-2, 2]) :
      resolvedPose === 'thinking' ? interpolate(idle.value, [0, 1], [-1, 1]) :
      resolvedPose === 'celebrating' ? interpolate(idle.value, [0, 1], [-3, 3]) :
      interpolate(idle.value, [0, 1], [1, -1]);

    return {
      opacity: transition.value,
      transform: [
        { scale: interpolate(transition.value, [0, 1], [0.92, 1]) },
        { translateY: interpolate(idle.value, [0, 1], [1, -3]) },
        { rotate: `${poseRotation}deg` },
      ],
    };
  }, [resolvedPose]);

  const poseElements = useMemo(() => {
    switch (resolvedPose) {
      case 'thinking':
        return (
          <>
            <Path d="M 75 110 Q 70 85 80 75" stroke="#FFB84D" strokeWidth="10" fill="none" strokeLinecap="round" />
            <Path d="M 125 110 L 125 145" stroke="#FFB84D" strokeWidth="10" fill="none" strokeLinecap="round" />
            <Circle cx="142" cy="42" r="4" fill="#FF6B6B" opacity="0.65" />
            <Circle cx="158" cy="31" r="6" fill="#FF6B6B" opacity="0.45" />
            <Circle cx="177" cy="20" r="8" fill="#FF6B6B" opacity="0.3" />
          </>
        );
      case 'celebrating':
        return (
          <>
            <Path d="M 75 110 Q 60 80 65 55" stroke="#FFB84D" strokeWidth="10" fill="none" strokeLinecap="round" />
            <Path d="M 125 110 Q 140 80 135 55" stroke="#FFB84D" strokeWidth="10" fill="none" strokeLinecap="round" />
            <Circle cx="65" cy="55" r="8" fill="#FF6B6B" />
            <Circle cx="135" cy="55" r="8" fill="#FF6B6B" />
            <Rect x="52" y="20" width="5" height="8" rx="2" fill="#FFD166" />
            <Rect x="69" y="27" width="5" height="8" rx="2" fill="#4ECDC4" />
            <Rect x="140" y="19" width="5" height="8" rx="2" fill="#95E1D3" />
            <Rect x="152" y="30" width="5" height="8" rx="2" fill="#FF6B6B" />
          </>
        );
      case 'sad':
        return (
          <>
            <Path d="M 75 110 L 70 145" stroke="#FFB84D" strokeWidth="10" fill="none" strokeLinecap="round" />
            <Path d="M 125 110 L 130 145" stroke="#FFB84D" strokeWidth="10" fill="none" strokeLinecap="round" />
            <Path d="M 87 73 Q 100 64 113 73" stroke="#2C3E50" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <Path d="M 88 58 Q 88 62 86 66" stroke="#7FB3FF" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </>
        );
      case 'waving':
      default:
        return (
          <>
            <Path d="M 75 110 Q 50 90 55 65" stroke="#FFB84D" strokeWidth="10" fill="none" strokeLinecap="round" />
            <Circle cx="55" cy="65" r="8" fill="#FF6B6B" />
            <Path d="M 125 110 Q 140 130 135 145" stroke="#FFB84D" strokeWidth="10" fill="none" strokeLinecap="round" />
          </>
        );
    }
  }, [resolvedPose]);

  return (
    <View style={[styles.container, style]}>
      {showBubble && message ? (
        <View style={styles.bubble}>
          <Text style={styles.bubbleText}>{message}</Text>
          <View style={styles.bubbleTail} />
        </View>
      ) : null}

      <AnimatedView style={animatedStyle}>
        <Svg width={resolvedSize} height={resolvedSize} viewBox="0 0 200 200">
          <Circle cx="100" cy="60" r="35" fill="#FFB84D" stroke="#FF6B6B" strokeWidth="3" />
          <Circle cx="88" cy="55" r="4" fill="#2C3E50" />
          <Circle cx="112" cy="55" r="4" fill="#2C3E50" />
          {resolvedPose !== 'sad' ? (
            <Path d="M 85 65 Q 100 75 115 65" stroke="#2C3E50" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          ) : null}
          <Ellipse cx="100" cy="125" rx="30" ry="40" fill="#FFB84D" stroke="#FF6B6B" strokeWidth="3" />
          {poseElements}
          <Rect x="80" y="160" width="12" height="25" rx="6" fill="#FFB84D" stroke="#FF6B6B" strokeWidth="2" />
          <Rect x="108" y="160" width="12" height="25" rx="6" fill="#FFB84D" stroke="#FF6B6B" strokeWidth="2" />
        </Svg>
      </AnimatedView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  bubble: {
    backgroundColor: Theme.surface,
    borderRadius: Theme.radius.card,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
    maxWidth: 300,
    borderWidth: 1,
    borderColor: Theme.cardBorderTint,
  },
  bubbleText: {
    fontSize: 15,
    color: Theme.text,
    textAlign: 'center',
    lineHeight: 22,
  },
  bubbleTail: {
    position: 'absolute',
    bottom: -8,
    alignSelf: 'center',
    left: '50%',
    marginLeft: -8,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: Theme.surface,
  },
});
