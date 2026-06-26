import type { ColorValue } from "react-native";
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
