import { Pressable, View } from "react-native";
import { Txt } from "@/components/ui/Txt";
import { Icon } from "@/components/Icon";

// Message composer bar (display + tap handlers for attach / mic).
export function Composer({
  placeholder = "Add a note…",
  onMic,
  onAttach,
  smiley = true,
}: {
  placeholder?: string;
  onMic?: () => void;
  onAttach?: () => void;
  smiley?: boolean;
}) {
  return (
    <View className="flex-row items-center border-t border-[#F0F0F2] bg-white px-[13px] pb-[16px] pt-[11px]" style={{ gap: 9 }}>
      <Pressable onPress={onAttach} className="h-[44px] w-[44px] items-center justify-center rounded-full bg-line">
        <Icon name="paperclip" size={21} weight="bold" color="#6B7280" />
      </Pressable>
      <View className="flex-1 flex-row items-center rounded-full bg-[#F3F4F6] px-[16px] py-[12px]" style={{ gap: 8 }}>
        {smiley ? <Icon name="smiley" size={18} color="#9CA3AF" /> : null}
        <Txt className="font-medium text-[13px] text-faint">{placeholder}</Txt>
      </View>
      <Pressable onPress={onMic} className="h-[44px] w-[44px] items-center justify-center rounded-full bg-orange">
        <Icon name="microphone" size={21} weight="fill" color="#fff" />
      </Pressable>
    </View>
  );
}
