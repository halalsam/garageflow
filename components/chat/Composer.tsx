import { useRef, useState } from "react";
import { Animated, PanResponder, Pressable, TextInput, View } from "react-native";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Icon } from "@/components/Icon";
import { RecordingBar } from "@/components/chat/RecordingBar";
import { useVoiceRecorder } from "@/components/chat/useVoiceRecorder";

const HOLD_DELAY = 220; // ms a press must last before it becomes a hold-to-record
const CANCEL_DX = -90; // px the finger must slide left to arm cancel
const MIC_MAX_SLIDE = -150; // furthest the mic follows the finger

// Interactive message composer.
// - Type + tap send to post text.
// - Tap the image button to attach a photo.
// - TAP the mic to open the full recording overlay (unchanged behaviour).
// - HOLD the mic to record WhatsApp-style: release to send, slide left to cancel.
export function Composer({
  placeholder = "Add a note…",
  onSend,
  onTapMic,
  onSendVoice,
  onAttach,
  onPickPhoto,
  smiley = true,
}: {
  placeholder?: string;
  onSend?: (text: string) => void;
  onTapMic?: () => void;
  onSendVoice?: (uri: string, seconds: number) => void;
  onAttach?: () => void;
  onPickPhoto?: () => void;
  smiley?: boolean;
}) {
  const insets = useSafeAreaInsets();
  const [text, setText] = useState("");
  const hasText = text.trim().length > 0;

  const rec = useVoiceRecorder();
  const [holding, setHolding] = useState(false);
  const [cancelArmed, setCancelArmed] = useState(false);

  // Refs keep the (one-time) PanResponder closures reading the latest values.
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isHoldRef = useRef(false);
  const cancelRef = useRef(false);
  const durationRef = useRef(0);
  durationRef.current = rec.durationMillis;
  const micX = useRef(new Animated.Value(0)).current;
  const latest = useRef({ onTapMic, onSendVoice, start: rec.start, stop: rec.stop });
  latest.current = { onTapMic, onSendVoice, start: rec.start, stop: rec.stop };

  const resetMic = () => Animated.spring(micX, { toValue: 0, useNativeDriver: true, speed: 20 }).start();

  const submit = () => {
    if (!hasText) return;
    onSend?.(text);
    setText("");
  };

  // Finalise a mic gesture. `terminated` means the OS cancelled the touch.
  const finishRef = useRef<(terminated: boolean) => void>(() => {});
  finishRef.current = async (terminated: boolean) => {
    if (holdTimer.current) {
      // Released before the hold threshold → it was a tap.
      clearTimeout(holdTimer.current);
      holdTimer.current = null;
      Haptics.selectionAsync();
      latest.current.onTapMic?.();
      return;
    }
    if (!isHoldRef.current) return; // hold never started (e.g. permission denied)
    isHoldRef.current = false;
    setHolding(false);
    setCancelArmed(false);
    resetMic();
    const cancelled = terminated || cancelRef.current;
    cancelRef.current = false;
    const seconds = Math.round(durationRef.current / 1000);
    const uri = await latest.current.stop();
    if (!cancelled && uri && seconds >= 1) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      latest.current.onSendVoice?.(uri, seconds);
    }
  };

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        cancelRef.current = false;
        setCancelArmed(false);
        micX.setValue(0);
        holdTimer.current = setTimeout(async () => {
          holdTimer.current = null;
          const ok = await latest.current.start();
          if (!ok) return;
          isHoldRef.current = true;
          setHolding(true);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }, HOLD_DELAY);
      },
      onPanResponderMove: (_e, g) => {
        if (!isHoldRef.current) return;
        // Mic follows the finger to the left while sliding toward cancel.
        micX.setValue(Math.max(MIC_MAX_SLIDE, Math.min(0, g.dx)));
        const armed = g.dx < CANCEL_DX;
        if (armed !== cancelRef.current) {
          cancelRef.current = armed;
          setCancelArmed(armed);
          if (armed) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        }
      },
      onPanResponderRelease: () => finishRef.current(false),
      onPanResponderTerminate: () => finishRef.current(true),
    }),
  ).current;

  const paddingBottom = insets.bottom > 0 ? insets.bottom + 8 : 16;

  return (
    <View
      className="flex-row items-center border-t border-[#F0F0F2] bg-white px-[13px] pt-[11px]"
      style={{ gap: 9, paddingBottom }}
    >
      {holding ? (
        <RecordingBar millis={rec.durationMillis} cancelArmed={cancelArmed} />
      ) : (
        <>
          <Pressable onPress={onAttach} className="h-[44px] w-[44px] items-center justify-center rounded-full bg-line">
            <Icon name="paperclip" size={21} weight="bold" color="#6B7280" />
          </Pressable>
          <View className="flex-1 flex-row items-center rounded-full bg-[#F3F4F6] px-[16px] py-[8px]" style={{ gap: 8 }}>
            {smiley ? <Icon name="smiley" size={18} color="#9CA3AF" /> : null}
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder={placeholder}
              placeholderTextColor="#9CA3AF"
              multiline
              className="flex-1 font-sans font-medium text-[13px] text-ink"
              style={{ maxHeight: 96, paddingTop: 0, paddingBottom: 0 }}
            />
            <Pressable onPress={onPickPhoto} hitSlop={8}>
              <Icon name="image" size={20} weight="regular" color="#9CA3AF" />
            </Pressable>
          </View>
        </>
      )}

      {hasText && !holding ? (
        <Pressable onPress={submit} className="h-[44px] w-[44px] items-center justify-center rounded-full bg-orange active:opacity-80">
          <Icon name="paper-plane-tilt" size={20} weight="fill" color="#fff" />
        </Pressable>
      ) : (
        <Animated.View {...pan.panHandlers} style={{ transform: [{ translateX: micX }] }}>
          <View className={`h-[44px] w-[44px] items-center justify-center rounded-full ${holding ? "bg-[#EF4444]" : "bg-orange"}`}>
            <Icon name="microphone" size={21} weight="fill" color="#fff" />
          </View>
        </Animated.View>
      )}
    </View>
  );
}
