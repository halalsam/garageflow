import { Tabs } from "expo-router";
import { tabIcon, TAB_SCREEN_OPTIONS } from "@/components/ui/tabIcon";

export default function AdminLayout() {
  return (
    <Tabs screenOptions={TAB_SCREEN_OPTIONS}>
      <Tabs.Screen name="dashboard" options={{ title: "Dashboard", tabBarIcon: tabIcon("squares-four") }} />
      <Tabs.Screen name="team" options={{ title: "Team", tabBarIcon: tabIcon("users-three") }} />
      <Tabs.Screen name="catalogue" options={{ title: "Catalogue", tabBarIcon: tabIcon("package") }} />
      <Tabs.Screen name="settings" options={{ title: "Settings", tabBarIcon: tabIcon("gear-six") }} />
    </Tabs>
  );
}
