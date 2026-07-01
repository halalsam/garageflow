import { useState } from "react";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Icon } from "@/components/Icon";
import { ComposerField } from "@/components/chat/ComposerField";
import { LockedRecordingBar } from "@/components/chat/LockedRecordingBar";
import { MicSendButton } from "@/components/chat/MicSendButton";
import { RecordingBar } from "@/components/chat/RecordingBar";
import { useComposerGesture } from "@/components/chat/useComposerGesture";

// WhatsApp-style message composer. Drives a 5-state machine — Idle · Typing ·
// Recording · Locked · Canceling — across a bottom-locked row.
//
// - Type + tap send (mic morphs to a send arrow) to post text.
// - Tap the paperclip / camera to attach.
// - HOLD the mic to record: release to send, slide left to cancel, swipe up to
//   lock into hands-free recording.
// - TAP the mic opens the full-screen overlay (onTapMic), unchanged.
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

  const gc = useComposerGesture({ hasText, onTapMic, onSendVoice });
  const { state } = gc;

  const submit = () => {
    if (!hasText) return;
    onSend?.(text);
    setText("");
  };

  const paddingBottom = insets.bottom > 0 ? insets.bottom + 8 : 16;
  const recording = state === "Recording" || state === "Canceling";

  return (
    <View
      className="flex-row items-end border-t border-[#F0F0F2] bg-white px-[13px] pt-[9px]"
      style={{ gap: 9, paddingBottom }}
    >
      {state === "Locked" ? (
        <LockedRecordingBar millis={gc.durationMillis} onCancel={gc.cancelLocked} onSend={gc.sendLocked} />
      ) : (
        <>
          {recording ? (
            <RecordingBar millis={gc.durationMillis} canceling={state === "Canceling"} />
          ) : (
            <>
              <Pressable onPress={onAttach} className="h-[48px] w-[48px] items-center justify-center rounded-full">
                <Icon name="paperclip" size={22} weight="bold" color="#6B7280" />
              </Pressable>
              <ComposerField
                value={text}
                onChangeText={setText}
                placeholder={placeholder}
                smiley={smiley}
                onPickPhoto={onPickPhoto}
              />
            </>
          )}

          <MicSendButton hasText={hasText} recording={recording} gc={gc} onSend={submit} />
        </>
      )}
    </View>
  );
}
