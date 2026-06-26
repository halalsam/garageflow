import { Tabs } from "expo-router";
import { tabIcon, useTabScreenOptions } from "@/components/ui/tabIcon";

export default function AdminLayout() {
  return (
    <Tabs screenOptions={useTabScreenOptions()}>
      <Tabs.Screen name="dashboard" options={{ title: "Dashboard", tabBarIcon: tabIcon("squares-four") }} />
      <Tabs.Screen name="team" options={{ title: "Team", tabBarIcon: tabIcon("users-three") }} />
      <Tabs.Screen name="catalogue" options={{ title: "Catalogue", tabBarIcon: tabIcon("package") }} />
      <Tabs.Screen name="settings" options={{ title: "Settings", tabBarIcon: tabIcon("gear-six") }} />
    </Tabs>
  );
}
