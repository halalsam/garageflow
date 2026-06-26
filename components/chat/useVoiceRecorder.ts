import { Alert } from "react-native";
import {
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from "expo-audio";

// Thin wrapper over expo-audio recording. `start()` requests the mic
// permission, arms the recorder and begins capture; `stop()` finalises the
// file and returns its uri. Live elapsed time is exposed via `durationMillis`.
export function useVoiceRecorder() {
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const state = useAudioRecorderState(recorder);

  const start = async (): Promise<boolean> => {
    const perm = await requestRecordingPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("Microphone needed", "Enable microphone access to record voice notes.");
      return false;
    }
    await setAudioModeAsync({ playsInSilentMode: true, allowsRecording: true });
    await recorder.prepareToRecordAsync();
    recorder.record();
    return true;
  };

  const stop = async (): Promise<string | null> => {
    try {
      await recorder.stop();
    } catch {
      // already stopped / never started
    }
    // Free the audio session so playback isn't forced through the earpiece.
    await setAudioModeAsync({ allowsRecording: false }).catch(() => {});
    return recorder.uri ?? null;
  };

  return { start, stop, isRecording: state.isRecording, durationMillis: state.durationMillis ?? 0 };
}
