// Expo push-notification plumbing: foreground display behavior, permission +
// token acquisition, and the tap → route mapping. The React glue lives in
// `usePushNotifications` — this file is framework-agnostic.
import { Platform } from "react-native";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

// How notifications render while the app is in the foreground.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// The last Expo token this device obtained, kept so logout can de-register it.
let storedToken: string | null = null;
export const getStoredPushToken = () => storedToken;

// A deep link captured before the user was authenticated (cold start from a
// notification, or a tap while logged out). Consumed once the session exists.
let pendingRoute: string | null = null;
export const setPendingRoute = (route: string | null) => {
  pendingRoute = route;
};
export const takePendingRoute = () => {
  const route = pendingRoute;
  pendingRoute = null;
  return route;
};

export const pushPlatform = (): "ios" | "android" | undefined =>
  Platform.OS === "ios" ? "ios" : Platform.OS === "android" ? "android" : undefined;

/**
 * Ask for permission and return this device's Expo push token (or null if the
 * user declined, we're on a simulator, or no EAS projectId is configured).
 */
export async function registerForPushNotificationsAsync(): Promise<string | null> {
  // Android 13+ won't surface the permission prompt until a channel exists.
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "Default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF5A1F",
    });
  }

  // Push tokens only exist on physical devices.
  if (!Device.isDevice) return null;

  const { status: existing } = await Notifications.getPermissionsAsync();
  let final = existing;
  if (existing !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    final = status;
  }
  if (final !== "granted") return null;

  const extra = Constants.expoConfig?.extra as { eas?: { projectId?: string } } | undefined;
  const projectId = extra?.eas?.projectId ?? (Constants as any)?.easConfig?.projectId;
  if (!projectId) return null;

  try {
    const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
    storedToken = token;
    return token;
  } catch {
    return null;
  }
}

// Map a push `data` payload to the in-app route to open. Every event deep-links
// to its job, except a freshly-submitted estimate which opens the approval.
export function routeForPush(data: unknown): string | null {
  const d = (data ?? {}) as { type?: string; jobCode?: string };
  if (!d.jobCode) return null;
  if (d.type === "estimate_submitted") return `/approval/${d.jobCode}`;
  return `/job/${d.jobCode}`;
}
