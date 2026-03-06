import { Audio } from 'expo-av';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RecordingResult {
  /** Local file URI of the recorded audio. */
  uri: string;
  /** Duration of the recording in seconds. */
  duration: number;
}

// ---------------------------------------------------------------------------
// Recording configuration
// ---------------------------------------------------------------------------

/**
 * High-quality recording preset optimised for speech capture.
 * Uses AAC encoding at 128 kbps / 44.1 kHz which balances file size with
 * enough fidelity for speech analysis (filler-word detection, clarity, etc.).
 */
const SPEECH_RECORDING_OPTIONS: Audio.RecordingOptions = {
  isMeteringEnabled: true,
  android: {
    extension: '.m4a',
    outputFormat: Audio.AndroidOutputFormat.MPEG_4,
    audioEncoder: Audio.AndroidAudioEncoder.AAC,
    sampleRate: 44100,
    numberOfChannels: 1,
    bitRate: 128000,
  },
  ios: {
    extension: '.m4a',
    outputFormat: Audio.IOSOutputFormat.MPEG4AAC,
    audioQuality: Audio.IOSAudioQuality.HIGH,
    sampleRate: 44100,
    numberOfChannels: 1,
    bitRate: 128000,
  },
  web: {
    mimeType: 'audio/webm',
    bitsPerSecond: 128000,
  },
};

// ---------------------------------------------------------------------------
// Public helpers
// ---------------------------------------------------------------------------

/**
 * Request microphone permissions from the user.
 *
 * @returns `true` if permission was granted, `false` otherwise.
 */
export async function getRecordingPermissions(): Promise<boolean> {
  const { granted } = await Audio.requestPermissionsAsync();
  return granted;
}

/**
 * Configure the audio session and start a new recording.
 *
 * Call {@link stopRecording} when the user finishes speaking.
 *
 * @returns The active `Audio.Recording` instance.
 */
export async function setupRecording(): Promise<Audio.Recording> {
  // Ensure the audio mode allows recording and plays nicely with the device.
  await Audio.setAudioModeAsync({
    allowsRecordingIOS: true,
    playsInSilentModeIOS: true,
  });

  const recording = new Audio.Recording();
  await recording.prepareToRecordAsync(SPEECH_RECORDING_OPTIONS);
  await recording.startAsync();

  return recording;
}

/**
 * Stop an active recording and return the resulting file URI and duration.
 *
 * @param recording - The `Audio.Recording` instance returned by {@link setupRecording}.
 * @returns An object containing the local `uri` and `duration` (in seconds).
 */
export async function stopRecording(
  recording: Audio.Recording,
): Promise<RecordingResult> {
  await recording.stopAndUnloadAsync();

  // Reset audio mode so playback works normally after recording.
  await Audio.setAudioModeAsync({
    allowsRecordingIOS: false,
  });

  const uri = recording.getURI();
  if (!uri) {
    throw new Error('Recording URI is unavailable after stopping.');
  }

  const status = await recording.getStatusAsync();
  const duration = (status.durationMillis ?? 0) / 1000;

  return { uri, duration };
}
