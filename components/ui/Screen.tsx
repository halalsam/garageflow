import { View } from "react-native";
import { SafeAreaView, type Edge } from "react-native-safe-area-context";

// Screen background wrapper. `edges` defaults to top only (tab bar handles bottom).
export function Screen({
  children,
  className = "",
  edges = ["top"],
  bg = "bg-bg",
}: {
  children: React.ReactNode;
  className?: string;
  edges?: Edge[];
  bg?: string;
}) {
  return (
    <SafeAreaView edges={edges} className={`flex-1 ${bg}`}>
      <View className={`flex-1 ${className}`}>{children}</View>
    </SafeAreaView>
  );
}
