import type { ColorValue } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Icon, type IconName } from "@/components/Icon";

// Factory for expo-router Tabs `tabBarIcon`: filled when focused.
export const tabIcon =
  (name: IconName) =>
  ({ color, focused }: { color: ColorValue; focused: boolean }) =>
    <Icon name={name} size={24} color={color as string} weight={focused ? "fill" : "regular"} />;

export const TAB_SCREEN_OPTIONS = {
  headerShown: false,
  tabBarActiveTintColor: "#FF5A1F",
  tabBarInactiveTintColor: "#B0B3BB",
  tabBarLabelStyle: { fontFamily: "Satoshi-Bold", fontSize: 10 },
  tabBarStyle: {
    backgroundColor: "#fff",
    borderTopColor: "#F0F0F2",
    paddingTop: 8,
  },
} as const;

// Tab options that lift the bar above Android's system navigation bar.
// With edge-to-edge the content draws behind it, so we pad by the bottom inset.
export function useTabScreenOptions() {
  const insets = useSafeAreaInsets();
  return {
    ...TAB_SCREEN_OPTIONS,
    tabBarStyle: {
      ...TAB_SCREEN_OPTIONS.tabBarStyle,
      height: 58 + insets.bottom,
      paddingBottom: insets.bottom + 6,
    },
  };
}
