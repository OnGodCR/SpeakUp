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
  G,
  Line,
  ClipPath,
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

// Color constants matching the reference mascot
const MC = {
  meshLight: '#C0C0C0',
  meshMid: '#A0A0A0',
  meshDark: '#888888',
  meshRing: '#B0B0B0',
  orange: '#FF6B35',
  orangeDark: '#E55A28',
  orangeLight: '#FF8F66',
  bodyDark: '#2A2A3E',
  bodyCharcoal: '#333348',
  vestNavy: '#1A1A2E',
  vestPurple: '#5B2BC7',
  vestTeal: '#0D9488',
  white: '#FFFFFF',
  eyeWhite: '#F5F5F5',
  shoeLace: '#FFFFFF',
} as const;

/**
 * Speaky -- the SpeakUp mascot.
 * A microphone character with silver mesh head, orange headband,
 * dark body, navy vest with SpeakUp logo, orange arms, and sneakers.
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
              d="M 68 115 Q 55 100 60 85"
              stroke={MC.orange}
              strokeWidth="9"
              fill="none"
              strokeLinecap="round"
            />
            {/* Left hand */}
            <Circle cx="60" cy="83" r="7" fill={MC.orange} />
            <Circle cx="57" cy="80" r="3" fill={MC.orangeLight} />
            {/* Right arm relaxed */}
            <Path
              d="M 132 115 Q 142 132 140 148"
              stroke={MC.orange}
              strokeWidth="9"
              fill="none"
              strokeLinecap="round"
            />
            <Circle cx="140" cy="149" r="6" fill={MC.orange} />
            {/* Thought bubbles */}
            <Circle cx="148" cy="38" r="4" fill={MC.meshMid} opacity="0.5" />
            <Circle cx="160" cy="28" r="5" fill={MC.meshMid} opacity="0.35" />
            <Circle cx="174" cy="18" r="7" fill={MC.meshMid} opacity="0.2" />
          </>
        );
      case 'celebrating':
        return (
          <>
            {/* Both arms raised - flexing */}
            <Path
              d="M 68 115 Q 45 90 50 60"
              stroke={MC.orange}
              strokeWidth="9"
              fill="none"
              strokeLinecap="round"
            />
            <Path
              d="M 132 115 Q 155 90 150 60"
              stroke={MC.orange}
              strokeWidth="9"
              fill="none"
              strokeLinecap="round"
            />
            {/* Fists */}
            <Circle cx="50" cy="57" r="8" fill={MC.orange} />
            <Circle cx="150" cy="57" r="8" fill={MC.orange} />
            {/* Bicep bumps */}
            <Circle cx="52" cy="78" r="5" fill={MC.orangeLight} opacity="0.5" />
            <Circle cx="148" cy="78" r="5" fill={MC.orangeLight} opacity="0.5" />
            {/* Sparkles */}
            <Path d="M 40 50 L 36 42 L 44 42 Z" fill="#FFD93D" />
            <Path d="M 160 50 L 156 42 L 164 42 Z" fill="#FFD93D" />
            <Circle cx="100" cy="18" r="3" fill="#FFD93D" />
            <Circle cx="36" cy="55" r="2" fill={MC.orange} />
            <Circle cx="164" cy="55" r="2" fill={MC.orange} />
          </>
        );
      case 'sad':
        return (
          <>
            {/* Arms drooping down */}
            <Path
              d="M 68 115 Q 62 135 58 155"
              stroke={MC.orange}
              strokeWidth="9"
              fill="none"
              strokeLinecap="round"
            />
            <Path
              d="M 132 115 Q 138 135 142 155"
              stroke={MC.orange}
              strokeWidth="9"
              fill="none"
              strokeLinecap="round"
            />
            <Circle cx="58" cy="156" r="6" fill={MC.orange} />
            <Circle cx="142" cy="156" r="6" fill={MC.orange} />
            {/* Tear drop */}
            <Path
              d="M 88 68 Q 86 76 88 79 Q 90 76 88 68"
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
              d="M 68 115 Q 42 92 46 62"
              stroke={MC.orange}
              strokeWidth="9"
              fill="none"
              strokeLinecap="round"
            />
            {/* Open hand (fingers) */}
            <Circle cx="46" cy="59" r="7" fill={MC.orange} />
            <Path d="M 42 55 L 38 48" stroke={MC.orange} strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <Path d="M 46 53 L 44 45" stroke={MC.orange} strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <Path d="M 50 54 L 50 46" stroke={MC.orange} strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <Path d="M 53 56 L 55 50" stroke={MC.orange} strokeWidth="3" strokeLinecap="round" fill="none" />
            {/* Right arm relaxed */}
            <Path
              d="M 132 115 Q 148 138 144 155"
              stroke={MC.orange}
              strokeWidth="9"
              fill="none"
              strokeLinecap="round"
            />
            <Circle cx="144" cy="156" r="6" fill={MC.orange} />
          </>
        );
    }
  }, [resolvedPose]);

  const eyeElements = useMemo(() => {
    if (resolvedPose === 'sad') {
      return (
        <>
          {/* Sad eyebrows */}
          <Path d="M 82 55 Q 88 51 94 54" stroke={MC.orange} strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <Path d="M 106 54 Q 112 51 118 55" stroke={MC.orange} strokeWidth="2.5" fill="none" strokeLinecap="round" />
          {/* Sad eyes */}
          <Ellipse cx="88" cy="62" rx="5.5" ry="4" fill={MC.eyeWhite} />
          <Ellipse cx="112" cy="62" rx="5.5" ry="4" fill={MC.eyeWhite} />
          <Circle cx="88" cy="63" r="3" fill="#2A2A3E" />
          <Circle cx="112" cy="63" r="3" fill="#2A2A3E" />
          {/* Sad mouth */}
          <Path d="M 90 74 Q 100 68 110 74" stroke="#2A2A3E" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </>
      );
    }
    if (resolvedPose === 'celebrating') {
      return (
        <>
          {/* Confident eyebrows */}
          <Path d="M 82 52 Q 88 48 94 52" stroke={MC.orange} strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <Path d="M 106 52 Q 112 48 118 52" stroke={MC.orange} strokeWidth="2.5" fill="none" strokeLinecap="round" />
          {/* Happy squinted eyes */}
          <Path d="M 82 60 Q 88 55 94 60" stroke="#2A2A3E" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <Path d="M 106 60 Q 112 55 118 60" stroke="#2A2A3E" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          {/* Big grin */}
          <Path d="M 85 70 Q 100 84 115 70" stroke="#2A2A3E" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <Path d="M 88 72 Q 100 80 112 72" fill={MC.white} />
        </>
      );
    }
    return (
      <>
        {/* Eyebrows */}
        <Path d="M 81 50 Q 88 47 95 51" stroke={MC.orange} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <Path d="M 105 51 Q 112 47 119 50" stroke={MC.orange} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        {/* Eyes - large round with highlights */}
        <Ellipse cx="88" cy="60" rx="6.5" ry="6" fill={MC.eyeWhite} />
        <Ellipse cx="112" cy="60" rx="6.5" ry="6" fill={MC.eyeWhite} />
        <Circle cx="89" cy="60" r="4" fill="#2A2A3E" />
        <Circle cx="113" cy="60" r="4" fill="#2A2A3E" />
        <Circle cx="91" cy="58" r="1.8" fill={MC.white} />
        <Circle cx="115" cy="58" r="1.8" fill={MC.white} />
        {/* Friendly smile */}
        <Path d="M 88 72 Q 100 82 112 72" stroke="#2A2A3E" strokeWidth="2.5" fill="none" strokeLinecap="round" />
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
        <Svg width={resolvedSize} height={resolvedSize} viewBox="0 0 200 210">
          <Defs>
            {/* Silver metallic gradient for mic head */}
            <LinearGradient id="meshGradHead" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor="#D0D0D0" />
              <Stop offset="0.3" stopColor="#B8B8B8" />
              <Stop offset="0.6" stopColor="#A0A0A0" />
              <Stop offset="1" stopColor="#909090" />
            </LinearGradient>
            {/* Orange portion gradient */}
            <LinearGradient id="orangeGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={MC.orangeLight} />
              <Stop offset="1" stopColor={MC.orange} />
            </LinearGradient>
            {/* Dark body gradient */}
            <LinearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={MC.bodyCharcoal} />
              <Stop offset="1" stopColor={MC.bodyDark} />
            </LinearGradient>
            {/* Vest gradient */}
            <LinearGradient id="vestGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={MC.vestNavy} />
              <Stop offset="1" stopColor="#151528" />
            </LinearGradient>
            {/* Clip for mesh grill area */}
            <ClipPath id="meshClip">
              <Ellipse cx="100" cy="32" rx="32" ry="28" />
            </ClipPath>
          </Defs>

          {/* === MICROPHONE MESH HEAD (silver dome) === */}
          <Ellipse
            cx="100"
            cy="32"
            rx="32"
            ry="28"
            fill="url(#meshGradHead)"
            stroke={MC.meshDark}
            strokeWidth="1.5"
          />
          {/* Mesh grill pattern (horizontal lines) */}
          <G clipPath="url(#meshClip)" opacity="0.45">
            <Line x1="70" y1="14" x2="130" y2="14" stroke={MC.meshDark} strokeWidth="1" />
            <Line x1="72" y1="20" x2="128" y2="20" stroke={MC.meshDark} strokeWidth="1" />
            <Line x1="70" y1="26" x2="130" y2="26" stroke={MC.meshDark} strokeWidth="1" />
            <Line x1="68" y1="32" x2="132" y2="32" stroke={MC.meshDark} strokeWidth="1" />
            <Line x1="70" y1="38" x2="130" y2="38" stroke={MC.meshDark} strokeWidth="1" />
            <Line x1="72" y1="44" x2="128" y2="44" stroke={MC.meshDark} strokeWidth="1" />
            <Line x1="76" y1="50" x2="124" y2="50" stroke={MC.meshDark} strokeWidth="1" />
            {/* Vertical cross-hatching */}
            <Line x1="82" y1="6" x2="82" y2="56" stroke={MC.meshDark} strokeWidth="0.7" />
            <Line x1="91" y1="5" x2="91" y2="58" stroke={MC.meshDark} strokeWidth="0.7" />
            <Line x1="100" y1="4" x2="100" y2="60" stroke={MC.meshDark} strokeWidth="0.7" />
            <Line x1="109" y1="5" x2="109" y2="58" stroke={MC.meshDark} strokeWidth="0.7" />
            <Line x1="118" y1="6" x2="118" y2="56" stroke={MC.meshDark} strokeWidth="0.7" />
          </G>
          {/* Mesh highlight */}
          <Ellipse cx="92" cy="24" rx="14" ry="10" fill={MC.white} opacity="0.15" />

          {/* === SILVER RING between mesh and face === */}
          <Rect x="68" y="56" width="64" height="6" rx="3" fill={MC.meshRing} stroke={MC.meshDark} strokeWidth="0.8" />

          {/* === ORANGE HEADBAND === */}
          <Rect x="66" y="61" width="68" height="10" rx="2" fill="url(#orangeGrad)" />
          {/* Headband eyelet details */}
          <Ellipse cx="78" cy="66" rx="3" ry="2" fill={MC.orangeDark} opacity="0.5" />
          <Ellipse cx="100" cy="66" rx="3" ry="2" fill={MC.orangeDark} opacity="0.5" />
          <Ellipse cx="122" cy="66" rx="3" ry="2" fill={MC.orangeDark} opacity="0.5" />

          {/* === FACE AREA (dark charcoal) === */}
          <Rect x="68" y="70" width="64" height="26" rx="4" fill="url(#bodyGrad)" />

          {/* Eyes and mouth - positioned on the face area */}
          <G transform="translate(0, 6)">
            {eyeElements}
          </G>

          {/* === VEST / BODY === */}
          <Rect x="66" y="94" width="68" height="52" rx="6" fill="url(#vestGrad)" stroke={MC.vestNavy} strokeWidth="1" />
          {/* Vest purple side accents */}
          <Rect x="66" y="94" width="8" height="52" rx="4" fill={MC.vestPurple} opacity="0.7" />
          <Rect x="126" y="94" width="8" height="52" rx="4" fill={MC.vestPurple} opacity="0.7" />
          {/* Vest teal accent line */}
          <Rect x="74" y="94" width="52" height="3" rx="1.5" fill={MC.vestTeal} opacity="0.6" />

          {/* SpeakUp "S" logo on vest */}
          <Circle cx="100" cy="115" r="10" fill={MC.orange} opacity="0.9" />
          <Path
            d="M 96 110 Q 103 108 105 112 Q 107 116 97 118 Q 93 120 96 122"
            stroke={MC.white}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />

          {/* === ARMS (orange, drawn behind body via ordering) === */}
          {poseElements}

          {/* === LEGS (dark navy) === */}
          <Rect x="82" y="146" width="12" height="30" rx="6" fill={MC.vestNavy} />
          <Rect x="106" y="146" width="12" height="30" rx="6" fill={MC.vestNavy} />

          {/* === SHOES (orange/navy sneakers) === */}
          {/* Left shoe */}
          <Ellipse cx="86" cy="178" rx="14" ry="7" fill={MC.orange} />
          <Ellipse cx="86" cy="176" rx="14" ry="5" fill={MC.vestNavy} />
          <Line x1="76" y1="178" x2="96" y2="178" stroke={MC.white} strokeWidth="1.2" />
          <Line x1="78" y1="180" x2="94" y2="180" stroke={MC.white} strokeWidth="0.8" />

          {/* Right shoe */}
          <Ellipse cx="114" cy="178" rx="14" ry="7" fill={MC.orange} />
          <Ellipse cx="114" cy="176" rx="14" ry="5" fill={MC.vestNavy} />
          <Line x1="104" y1="178" x2="124" y2="178" stroke={MC.white} strokeWidth="1.2" />
          <Line x1="106" y1="180" x2="122" y2="180" stroke={MC.white} strokeWidth="0.8" />
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
