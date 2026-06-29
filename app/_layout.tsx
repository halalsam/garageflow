import "../global.css";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/lib/auth";
import { queryClient } from "@/lib/api/queryClient";
import { PushNotificationsGate } from "@/components/notifications/PushNotificationsGate";

export default function RootLayout() {
  const [loaded] = useFonts({
    "Satoshi-Regular": require("../assets/fonts/Satoshi-Regular.ttf"),
    "Satoshi-Medium": require("../assets/fonts/Satoshi-Medium.ttf"),
    "Satoshi-Bold": require("../assets/fonts/Satoshi-Bold.ttf"),
    "Satoshi-Black": require("../assets/fonts/Satoshi-Black.ttf"),
  });

  if (!loaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <AuthProvider>
            <PushNotificationsGate />
            <StatusBar style="dark" />
            <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "#F7F7F8" } }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="(tech)" />
              <Stack.Screen name="(manager)" />
              <Stack.Screen name="(admin)" />
              <Stack.Screen name="job/[id]" />
              <Stack.Screen name="job/new" options={{ presentation: "modal" }} />
              <Stack.Screen name="approval/[id]" />
              <Stack.Screen name="invoice/[id]" />
              <Stack.Screen name="finance/gst" />
              <Stack.Screen name="finance/expenses" />
              <Stack.Screen name="finance/ledgers" />
              <Stack.Screen name="finance/ledger/[party]" />
            </Stack>
          </AuthProvider>
        </SafeAreaProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
