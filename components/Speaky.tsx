import React, { useEffect, useMemo } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle, Text } from 'react-native';
import Svg, {
  Circle,
  Ellipse,
  Path,
  Rect,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Colors } from '../constants/Colors';

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

/**
 * Speaky -- the SpeakUp mascot.
 * An anthropomorphic microphone with arms, legs, and expressive eyes.
 * Supports poses: waving, thinking, celebrating, sad.
 */
export default function Speaky({
  pose,
  mood,
  size = 150,
  message,
  style,
  showBubble = true,
}: SpeakyProps) {
  const resolvedPose = pose ?? (mood ? POSE_MOOD_MAP[mood] : 'waving');
  const resolvedSize = typeof size === 'number' ? size : size === 'small' ? 92 : 152;

  const transition = useSharedValue(0);
  const idle = useSharedValue(0);

  useEffect(() => {
    transition.value = 0;
    transition.value = withTiming(1, {
      duration: 300,
      easing: Easing.out(Easing.cubic),
    });
  }, [resolvedPose]);

  useEffect(() => {
    idle.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
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
        { scale: interpolate(transition.value, [0, 1], [0.94, 1]) },
        { translateY: interpolate(idle.value, [0, 1], [1, -4]) },
        { rotate: `${poseRotation}deg` },
      ],
    };
  }, [resolvedPose]);

  const poseElements = useMemo(() => {
    switch (resolvedPose) {
      case 'thinking':
        return (
          <>
            {/* Left arm raised to chin */}
            <Path
              d="M 65 120 Q 55 105 60 90"
              stroke={Colors.accent}
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
            />
            <Circle cx="60" cy="88" r="6" fill={Colors.accent} />
            {/* Right arm relaxed */}
            <Path
              d="M 135 120 Q 145 135 140 148"
              stroke={Colors.accent}
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
            />
            {/* Thought bubbles */}
            <Circle cx="148" cy="38" r="4" fill={Colors.primaryLight} opacity="0.5" />
            <Circle cx="160" cy="28" r="5" fill={Colors.primaryLight} opacity="0.35" />
            <Circle cx="174" cy="18" r="7" fill={Colors.primaryLight} opacity="0.2" />
          </>
        );
      case 'celebrating':
        return (
          <>
            {/* Both arms raised up */}
            <Path
              d="M 65 120 Q 48 90 52 58"
              stroke={Colors.accent}
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
            />
            <Path
              d="M 135 120 Q 152 90 148 58"
              stroke={Colors.accent}
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
            />
            {/* Hands */}
            <Circle cx="52" cy="55" r="7" fill={Colors.accent} />
            <Circle cx="148" cy="55" r="7" fill={Colors.accent} />
            {/* Sparkles */}
            <Path d="M 42 48 L 38 42 L 46 42 Z" fill="#FFD93D" />
            <Path d="M 158 48 L 154 42 L 162 42 Z" fill="#FFD93D" />
            <Circle cx="100" cy="22" r="3" fill="#FFD93D" />
            <Circle cx="85" cy="28" r="2" fill={Colors.accent} />
            <Circle cx="115" cy="26" r="2" fill={Colors.accent} />
          </>
        );
      case 'sad':
        return (
          <>
            {/* Arms drooping down */}
            <Path
              d="M 65 120 L 58 152"
              stroke={Colors.accent}
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
            />
            <Path
              d="M 135 120 L 142 152"
              stroke={Colors.accent}
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
            />
            {/* Tear drop */}
            <Path
              d="M 88 68 Q 86 74 88 76 Q 90 74 88 68"
              fill="#60A5FA"
              opacity="0.7"
            />
          </>
        );
      case 'waving':
      default:
        return (
          <>
            {/* Left arm waving up */}
            <Path
              d="M 65 120 Q 42 98 48 68"
              stroke={Colors.accent}
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
            />
            <Circle cx="48" cy="65" r="7" fill={Colors.accent} />
            {/* Right arm relaxed */}
            <Path
              d="M 135 120 Q 148 140 144 155"
              stroke={Colors.accent}
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
            />
          </>
        );
    }
  }, [resolvedPose]);

  const eyeElements = useMemo(() => {
    if (resolvedPose === 'sad') {
      return (
        <>
          <Ellipse cx="88" cy="58" rx="5" ry="3.5" fill={Colors.deepNavy} />
          <Ellipse cx="112" cy="58" rx="5" ry="3.5" fill={Colors.deepNavy} />
          <Path d="M 82 52 Q 88 49 94 52" stroke={Colors.deepNavy} strokeWidth="2" fill="none" strokeLinecap="round" />
          <Path d="M 106 52 Q 112 49 118 52" stroke={Colors.deepNavy} strokeWidth="2" fill="none" strokeLinecap="round" />
          <Path d="M 90 70 Q 100 64 110 70" stroke={Colors.deepNavy} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </>
      );
    }
    if (resolvedPose === 'celebrating') {
      return (
        <>
          <Path d="M 82 57 Q 88 52 94 57" stroke={Colors.deepNavy} strokeWidth="3" fill="none" strokeLinecap="round" />
          <Path d="M 106 57 Q 112 52 118 57" stroke={Colors.deepNavy} strokeWidth="3" fill="none" strokeLinecap="round" />
          <Path d="M 86 67 Q 100 80 114 67" stroke={Colors.deepNavy} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </>
      );
    }
    return (
      <>
        <Circle cx="88" cy="56" r="5" fill={Colors.deepNavy} />
        <Circle cx="112" cy="56" r="5" fill={Colors.deepNavy} />
        <Circle cx="90" cy="54" r="1.8" fill="#FFFFFF" />
        <Circle cx="114" cy="54" r="1.8" fill="#FFFFFF" />
        <Path d="M 88 68 Q 100 78 112 68" stroke={Colors.deepNavy} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </>
    );
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
          <Defs>
            <LinearGradient id="micGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={Colors.primaryLight} />
              <Stop offset="1" stopColor={Colors.primary} />
            </LinearGradient>
            <LinearGradient id="meshGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#8B5CF6" stopOpacity="0.4" />
              <Stop offset="1" stopColor="#6C3CE1" stopOpacity="0.2" />
            </LinearGradient>
          </Defs>

          {/* Microphone head (rounded top) */}
          <Ellipse
            cx="100"
            cy="55"
            rx="34"
            ry="36"
            fill="url(#micGrad)"
            stroke={Colors.primaryDark}
            strokeWidth="2"
          />

          {/* Mesh grill lines on mic head */}
          <Path d="M 72 45 Q 100 40 128 45" stroke="url(#meshGrad)" strokeWidth="1.5" fill="none" />
          <Path d="M 70 55 Q 100 50 130 55" stroke="url(#meshGrad)" strokeWidth="1.5" fill="none" />
          <Path d="M 72 65 Q 100 60 128 65" stroke="url(#meshGrad)" strokeWidth="1.5" fill="none" />

          {/* Eyes and mouth */}
          {eyeElements}

          {/* Microphone body (cylindrical) */}
          <Rect
            x="78"
            y="88"
            width="44"
            height="52"
            rx="8"
            fill={Colors.deepNavy}
            stroke={Colors.primaryDark}
            strokeWidth="1.5"
          />

          {/* Body highlight stripe */}
          <Rect
            x="82"
            y="92"
            width="4"
            height="44"
            rx="2"
            fill={Colors.primaryLight}
            opacity="0.25"
          />

          {/* Accent ring between head and body */}
          <Rect
            x="74"
            y="84"
            width="52"
            height="8"
            rx="4"
            fill={Colors.accent}
          />

          {/* Arms */}
          {poseElements}

          {/* Legs */}
          <Rect x="85" y="140" width="10" height="28" rx="5" fill={Colors.accent} />
          <Rect x="105" y="140" width="10" height="28" rx="5" fill={Colors.accent} />

          {/* Shoes */}
          <Ellipse cx="90" cy="170" rx="10" ry="5" fill={Colors.deepNavy} />
          <Ellipse cx="110" cy="170" rx="10" ry="5" fill={Colors.deepNavy} />
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
    backgroundColor: Colors.surface,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
    maxWidth: 300,
    borderWidth: 1.5,
    borderColor: Colors.surfaceBorder,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  bubbleText: {
    fontSize: 15,
    color: Colors.textPrimary,
    textAlign: 'center',
    lineHeight: 22,
    fontStyle: 'italic',
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
    borderTopColor: Colors.surface,
  },
});
