import { Tabs } from "expo-router";
import { tabIcon, TAB_SCREEN_OPTIONS } from "@/components/ui/tabIcon";

export default function ManagerLayout() {
  return (
    <Tabs screenOptions={TAB_SCREEN_OPTIONS}>
      <Tabs.Screen name="dashboard" options={{ title: "Dashboard", tabBarIcon: tabIcon("squares-four") }} />
      <Tabs.Screen name="jobs" options={{ title: "Jobs", tabBarIcon: tabIcon("list-checks") }} />
      <Tabs.Screen name="approvals" options={{ title: "Approvals", tabBarIcon: tabIcon("seal-check") }} />
      <Tabs.Screen name="profile" options={{ title: "Profile", tabBarIcon: tabIcon("user") }} />
    </Tabs>
  );
}
