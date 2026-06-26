import { View } from "react-native";

export function ProgressBar({ value, color = "#FF5A1F" }: { value: number; color?: string }) {
  return (
    <View className="h-[6px] overflow-hidden rounded-full bg-line">
      <View
        className="h-full rounded-full"
        style={{ width: `${Math.max(0, Math.min(100, value))}%`, backgroundColor: color }}
      />
    </View>
  );
}
