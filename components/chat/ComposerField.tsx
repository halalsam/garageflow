import { useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import { Icon } from "@/components/Icon";

const LINE_HEIGHT = 20; // px per visible line at 13px/medium
const MAX_LINES = 5; // grow to 5 lines, then scroll internally

// The rounded text pill: emoji toggle, growing multiline input (capped at 5
// visible lines), and an inline camera/photo affordance. Owns its own height
// measurement so the whole composer expands with the content.
export function ComposerField({
  value,
  onChangeText,
  placeholder,
  smiley,
  onToggleEmoji,
  onPickPhoto,
}: {
  value: string;
  onChangeText: (t: string) => void;
  placeholder: string;
  smiley: boolean;
  onToggleEmoji?: () => void;
  onPickPhoto?: () => void;
}) {
  const [lines, setLines] = useState(1);
  const visibleLines = Math.min(Math.max(lines, 1), MAX_LINES);
  const inputHeight = visibleLines * LINE_HEIGHT;

  return (
    <View className="flex-1 flex-row items-end rounded-[22px] bg-[#F3F4F6] px-[6px]" style={{ gap: 4 }}>
      {smiley ? (
        <Pressable
          onPress={onToggleEmoji}
          hitSlop={4}
          className="h-[48px] w-[40px] items-center justify-center"
        >
          <Icon name="smiley" size={20} color="#9CA3AF" />
        </Pressable>
      ) : (
        <View style={{ width: 8 }} />
      )}

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        multiline
        scrollEnabled={lines >= MAX_LINES}
        onContentSizeChange={(e) => {
          const h = e.nativeEvent.contentSize.height;
          setLines(Math.max(1, Math.round(h / LINE_HEIGHT)));
        }}
        className="flex-1 font-sans font-medium text-[13px] text-ink"
        style={{
          height: inputHeight,
          lineHeight: LINE_HEIGHT,
          paddingTop: 0,
          paddingBottom: 0,
          // Center the collapsed input within the 48dp minimum row height.
          marginVertical: (48 - LINE_HEIGHT) / 2,
        }}
      />

      <Pressable onPress={onPickPhoto} hitSlop={4} className="h-[48px] w-[48px] items-center justify-center">
        <Icon name="camera" size={22} weight="regular" color="#9CA3AF" />
      </Pressable>
    </View>
  );
}
