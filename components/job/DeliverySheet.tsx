import { useState } from "react";
import { Alert, Image, Pressable, ScrollView, TextInput, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Txt } from "@/components/ui/Txt";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/Icon";
import { VoiceOverlay } from "@/components/screens/VoiceOverlay";
import { COMPLETION_SIDES, type CompletionPhoto, type CompletionSide } from "@/types/api";

const LABELS: Record<CompletionSide, string> = {
  front: "Front",
  back: "Back",
  left: "Left",
  right: "Right",
};

// Guided hand-off flow for marking a vehicle DELIVERED. Two simple steps for a
// non-technical user: (1) snap the four sides, (2) add a note (typed or voice).
// The confirm button stays disabled until both are done. Photos upload as they
// are captured (via onCapture, which returns the refreshed photo list); the note
// is passed back on confirm.
export function DeliverySheet({
  visible,
  photos,
  busySide,
  submitting,
  onClose,
  onCapture,
  onConfirm,
}: {
  visible: boolean;
  photos: CompletionPhoto[];
  busySide?: CompletionSide | null;
  submitting?: boolean;
  onClose: () => void;
  onCapture: (side: CompletionSide) => void;
  onConfirm: (note: { text?: string; audioUri?: string; seconds?: number }) => void;
}) {
  const insets = useSafeAreaInsets();
  const [note, setNote] = useState("");
  const [voice, setVoice] = useState<{ uri: string; seconds: number } | null>(null);
  const [recording, setRecording] = useState(false);

  const bySide = new Map(photos.map((p) => [p.side, p.uri]));
  const have = COMPLETION_SIDES.filter((s) => bySide.has(s)).length;
  const photosDone = have === COMPLETION_SIDES.length;
  const hasNote = note.trim().length > 0 || !!voice;
  const canConfirm = photosDone && hasNote && !submitting;

  const capture = async (side: CompletionSide) => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("Camera access needed", "Enable camera permission to take delivery photos.");
      return;
    }
    onCapture(side);
  };

  const confirm = () => {
    onConfirm(
      voice ? { audioUri: voice.uri, seconds: voice.seconds } : { text: note.trim() },
    );
  };

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: insets.bottom + 18 }}
        keyboardShouldPersistTaps="handled"
      >
        <Txt className="mb-[3px] font-black text-[19px]">Deliver vehicle</Txt>
        <Txt className="mb-[16px] font-medium text-[13px] text-muted">
          Take four photos and add a quick note before handing over.
        </Txt>

        {/* Step 1 — photos */}
        <View className="mb-[8px] flex-row items-center justify-between">
          <Txt className="font-bold text-[13px]">1. Photos</Txt>
          <Txt className={`font-bold text-[12px] ${photosDone ? "text-[#16A34A]" : "text-muted"}`}>
            {have}/{COMPLETION_SIDES.length}
          </Txt>
        </View>
        <View className="flex-row" style={{ gap: 8 }}>
          {COMPLETION_SIDES.map((side) => {
            const uri = bySide.get(side);
            const busy = busySide === side;
            return (
              <Pressable
                key={side}
                className="flex-1"
                disabled={busy}
                onPress={() => capture(side)}
                style={{ opacity: busy ? 0.5 : 1 }}
              >
                <View
                  className="items-center justify-center overflow-hidden rounded-[10px] bg-[#F3F4F6]"
                  style={{ aspectRatio: 1, borderWidth: uri ? 0 : 1, borderColor: "#E5E7EB", borderStyle: "dashed" }}
                >
                  {uri ? (
                    <Image source={{ uri }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
                  ) : (
                    <Icon name="camera" size={18} color="#9CA3AF" weight="regular" />
                  )}
                </View>
                <Txt className="mt-[4px] text-center font-medium text-[10px] text-muted">{LABELS[side]}</Txt>
              </Pressable>
            );
          })}
        </View>

        {/* Step 2 — note */}
        <Txt className="mb-[8px] mt-[18px] font-bold text-[13px]">2. Hand-over note</Txt>
        {voice ? (
          <View className="flex-row items-center justify-between rounded-[12px] bg-[#F3F4F6] px-[14px] py-[12px]">
            <View className="flex-row items-center" style={{ gap: 8 }}>
              <Icon name="microphone" size={18} color="#16A34A" weight="fill" />
              <Txt className="font-bold text-[13px]">Voice note · {voice.seconds}s</Txt>
            </View>
            <Pressable onPress={() => setVoice(null)} hitSlop={8}>
              <Icon name="trash" size={18} color="#9CA3AF" />
            </Pressable>
          </View>
        ) : (
          <View className="flex-row items-center rounded-[12px] bg-[#F3F4F6] px-[14px]" style={{ gap: 8 }}>
            <TextInput
              value={note}
              onChangeText={setNote}
              placeholder="Type a note…"
              placeholderTextColor="#9CA3AF"
              multiline
              className="flex-1 py-[12px] font-sans font-medium text-[13px] text-ink"
              style={{ maxHeight: 88 }}
            />
            <Pressable onPress={() => setRecording(true)} hitSlop={8}>
              <Icon name="microphone" size={20} color="#6B7280" weight="fill" />
            </Pressable>
          </View>
        )}

        <Button
          label={submitting ? "Delivering…" : "Confirm delivery"}
          variant="green"
          icon="seal-check"
          className="mt-[20px]"
          style={canConfirm ? undefined : { opacity: 0.5 }}
          disabled={!canConfirm}
          onPress={confirm}
        />
      </ScrollView>

      <VoiceOverlay
        visible={recording}
        onCancel={() => setRecording(false)}
        onSendVoice={(uri, seconds) => {
          setRecording(false);
          setVoice({ uri, seconds });
        }}
      />
    </BottomSheet>
  );
}
