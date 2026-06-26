import { Tabs } from "expo-router";
import { tabIcon, useTabScreenOptions } from "@/components/ui/tabIcon";

export default function ManagerLayout() {
  return (
    <Tabs screenOptions={useTabScreenOptions()}>
      <Tabs.Screen name="dashboard" options={{ title: "Dashboard", tabBarIcon: tabIcon("squares-four") }} />
      <Tabs.Screen name="jobs" options={{ title: "Jobs", tabBarIcon: tabIcon("list-checks") }} />
      <Tabs.Screen name="approvals" options={{ title: "Approvals", tabBarIcon: tabIcon("seal-check") }} />
      <Tabs.Screen name="profile" options={{ title: "Profile", tabBarIcon: tabIcon("user") }} />
    </Tabs>
  );
}
