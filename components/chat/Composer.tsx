import { useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import { Icon } from "@/components/Icon";

// Interactive message composer. Holds its own draft text; the mic button swaps
// to a send button as soon as there is something to send.
export function Composer({
  placeholder = "Add a note…",
  onSend,
  onMic,
  onAttach,
  smiley = true,
}: {
  placeholder?: string;
  onSend?: (text: string) => void;
  onMic?: () => void;
  onAttach?: () => void;
  smiley?: boolean;
}) {
  const [text, setText] = useState("");
  const hasText = text.trim().length > 0;

  const submit = () => {
    if (!hasText) return;
    onSend?.(text);
    setText("");
  };

  return (
    <View className="flex-row items-center border-t border-[#F0F0F2] bg-white px-[13px] pb-[16px] pt-[11px]" style={{ gap: 9 }}>
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
      </View>
      {hasText ? (
        <Pressable onPress={submit} className="h-[44px] w-[44px] items-center justify-center rounded-full bg-orange active:opacity-80">
          <Icon name="paper-plane-tilt" size={20} weight="fill" color="#fff" />
        </Pressable>
      ) : (
        <Pressable onPress={onMic} className="h-[44px] w-[44px] items-center justify-center rounded-full bg-orange active:opacity-80">
          <Icon name="microphone" size={21} weight="fill" color="#fff" />
        </Pressable>
      )}
    </View>
  );
}
