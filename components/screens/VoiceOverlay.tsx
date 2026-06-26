import { Modal, Pressable, View } from "react-native";
import { Txt } from "@/components/ui/Txt";
import { Waveform } from "@/components/chat/Chat";
import { Icon } from "@/components/Icon";

// T5 · Voice note recording overlay
export function VoiceOverlay({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 justify-end" style={{ backgroundColor: "rgba(20,16,12,0.55)" }}>
        <View className="flex-1 items-center justify-center" style={{ paddingBottom: 40 }}>
          <View
            className="h-[96px] w-[96px] items-center justify-center rounded-full bg-orange"
            style={{ shadowColor: "#FF5A1F", shadowOpacity: 0.25, shadowRadius: 28, shadowOffset: { width: 0, height: 0 } }}
          >
            <Icon name="microphone" size={42} color="#fff" weight="fill" />
          </View>
          <Txt className="mt-[34px] font-black text-[28px] text-white" style={{ fontVariant: ["tabular-nums"] }}>
            0:08
          </Txt>
          <Waveform
            height={40}
            gap={3}
            color="#FFFFFF"
            bars={[2, 4, 3, 5, 4, 6, 3, 5, 4, 2, 3, 5, 4, 1, 3]}
          />
          <View className="mt-[30px] flex-row items-center" style={{ gap: 6 }}>
            <Icon name="caret-left" size={14} weight="bold" color="rgba(255,255,255,0.8)" />
            <Txt className="font-bold text-[13px]" style={{ color: "rgba(255,255,255,0.8)" }}>
              Slide to cancel
            </Txt>
          </View>
        </View>

        <Pressable onPress={onClose}>
          <View className="flex-row items-center bg-orange px-[13px] pb-[16px] pt-[11px]" style={{ gap: 9 }}>
            <View className="flex-1 flex-row items-center rounded-full px-[16px] py-[12px]" style={{ backgroundColor: "rgba(255,255,255,0.22)", gap: 7 }}>
              <Icon name="circle" size={10} color="#fff" weight="fill" />
              <Txt className="font-bold text-[13px] text-white">Recording… release to send</Txt>
            </View>
            <View className="h-[44px] w-[44px] items-center justify-center rounded-full bg-white">
              <Icon name="microphone" size={21} color="#FF5A1F" weight="fill" />
            </View>
          </View>
        </Pressable>
      </View>
    </Modal>
  );
}
