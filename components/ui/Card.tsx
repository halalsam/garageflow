import { Pressable, View, type ViewProps } from "react-native";
import { cardShadow } from "@/lib/theme";

type Props = ViewProps & { className?: string; onPress?: () => void };

// Static card, or a pressable card when `onPress` is provided.
export function Card({ className = "", style, onPress, ...props }: Props) {
  const cls = `bg-white rounded-card p-[15px] ${className}`;
  if (onPress) {
    return (
      <Pressable className={`${cls} active:opacity-90`} style={[cardShadow, style]} onPress={onPress} {...props} />
    );
  }
  return <View className={cls} style={[cardShadow, style]} {...props} />;
}
