import { useEffect, useRef, useState } from "react";
import { Modal, Pressable, View } from "react-native";
import { Txt } from "@/components/ui/Txt";
import { Waveform } from "@/components/chat/Chat";
import { Icon } from "@/components/Icon";
import { fmtDuration } from "@/components/chat/useChat";

const BAR_COUNT = 18;
const randomBars = () => Array.from({ length: BAR_COUNT }, () => 1 + Math.floor(Math.random() * 6));

// T5 · Voice note recording overlay.
// Simulated capture in local state: counts elapsed seconds and animates the
// waveform while open, then hands the duration back via `onSend`.
export function VoiceOverlay({
  visible,
  onSend,
  onCancel,
}: {
  visible: boolean;
  onSend: (seconds: number) => void;
  onCancel: () => void;
}) {
  const [seconds, setSeconds] = useState(0);
  const [bars, setBars] = useState<number[]>(randomBars);
  const secRef = useRef(0);

  useEffect(() => {
    if (!visible) return;
    secRef.current = 0;
    setSeconds(0);
    setBars(randomBars());

    const tick = setInterval(() => {
      secRef.current += 1;
      setSeconds(secRef.current);
    }, 1000);
    const wave = setInterval(() => setBars(randomBars()), 220);

    return () => {
      clearInterval(tick);
      clearInterval(wave);
    };
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View className="flex-1 justify-end" style={{ backgroundColor: "rgba(20,16,12,0.55)" }}>
        <View className="flex-1 items-center justify-center" style={{ paddingBottom: 40 }}>
          <View
            className="h-[96px] w-[96px] items-center justify-center rounded-full bg-orange"
            style={{ shadowColor: "#FF5A1F", shadowOpacity: 0.25, shadowRadius: 28, shadowOffset: { width: 0, height: 0 } }}
          >
            <Icon name="microphone" size={42} color="#fff" weight="fill" />
          </View>
          <Txt className="mt-[34px] font-black text-[28px] text-white" style={{ fontVariant: ["tabular-nums"] }}>
            {fmtDuration(seconds)}
          </Txt>
          <Waveform height={40} gap={3} color="#FFFFFF" bars={bars} />
          <Pressable onPress={onCancel} hitSlop={10} className="mt-[30px] flex-row items-center" style={{ gap: 6 }}>
            <Icon name="x-circle" size={16} weight="fill" color="rgba(255,255,255,0.85)" />
            <Txt className="font-bold text-[13px]" style={{ color: "rgba(255,255,255,0.8)" }}>
              Tap to cancel
            </Txt>
          </Pressable>
        </View>

        <Pressable onPress={() => onSend(secRef.current)}>
          <View className="flex-row items-center bg-orange px-[13px] pb-[16px] pt-[11px]" style={{ gap: 9 }}>
            <View className="flex-1 flex-row items-center rounded-full px-[16px] py-[12px]" style={{ backgroundColor: "rgba(255,255,255,0.22)", gap: 7 }}>
              <Icon name="circle" size={10} color="#fff" weight="fill" />
              <Txt className="font-bold text-[13px] text-white">Recording… tap to send</Txt>
            </View>
            <View className="h-[44px] w-[44px] items-center justify-center rounded-full bg-white">
              <Icon name="paper-plane-tilt" size={20} color="#FF5A1F" weight="fill" />
            </View>
          </View>
        </Pressable>
      </View>
    </Modal>
  );
}
