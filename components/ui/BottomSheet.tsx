import { Modal, Pressable, View } from "react-native";

// Lightweight bottom sheet: dim backdrop + rounded panel. No reanimated dep.
export function BottomSheet({
  visible,
  onClose,
  children,
  height,
}: {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  height?: number;
}) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 justify-end" style={{ backgroundColor: "rgba(15,12,8,0.42)" }}>
        <Pressable className="flex-1" onPress={onClose} />
        <View
          className="rounded-t-[26px] bg-white"
          style={{ height, shadowColor: "#000", shadowOpacity: 0.18, shadowRadius: 40, shadowOffset: { width: 0, height: -10 }, elevation: 24 }}
        >
          <View className="my-[11px] h-[5px] w-[42px] self-center rounded-full bg-[#E2E2E8]" />
          {children}
        </View>
      </View>
    </Modal>
  );
}
