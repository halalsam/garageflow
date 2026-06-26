import { Pressable } from "react-native";
import * as Haptics from "expo-haptics";
import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { Txt } from "@/components/ui/Txt";
import { Icon } from "@/components/Icon";
import { Waveform } from "@/components/chat/Chat";

// Inline voice-note player. Recorded notes carry a `uri` and are tappable to
// play/pause; the seeded mock notes have no uri and render as a static bubble.
export function VoiceMessage({ uri, dur }: { uri?: string; dur: string }) {
  const player = useAudioPlayer(uri ?? undefined);
  const status = useAudioPlayerStatus(player);
  const playing = !!uri && status.playing;

  const toggle = async () => {
    if (!uri) return;
    Haptics.selectionAsync();
    if (playing) {
      player.pause();
      return;
    }
    // Recording leaves the session in earpiece/comms mode on Android — force it
    // back to the loud speaker route before playback, at full volume.
    await setAudioModeAsync({ playsInSilentMode: true, allowsRecording: false });
    player.volume = 1;
    // Restart if we're at the end.
    if (status.duration && status.currentTime >= status.duration - 0.05) player.seekTo(0);
    player.play();
  };

  return (
    <Pressable onPress={toggle} className="flex-row items-center" style={{ gap: 8 }}>
      <Icon name={playing ? "pause" : "play"} size={18} color="#FF5A1F" weight="fill" />
      <Waveform />
      <Txt className="font-bold text-[11px] text-muted">{dur}</Txt>
    </Pressable>
  );
}
