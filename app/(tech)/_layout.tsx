import { Tabs } from "expo-router";
import { tabIcon, useTabScreenOptions } from "@/components/ui/tabIcon";

export default function TechLayout() {
  return (
    <Tabs screenOptions={useTabScreenOptions()}>
      <Tabs.Screen name="jobs" options={{ title: "Jobs", tabBarIcon: tabIcon("wrench") }} />
      <Tabs.Screen name="search" options={{ title: "Search", tabBarIcon: tabIcon("search") }} />
      <Tabs.Screen name="profile" options={{ title: "Profile", tabBarIcon: tabIcon("user") }} />
    </Tabs>
  );
}
