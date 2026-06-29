// Registers the device for push on sign-in and routes notification taps to the
// right screen. Mounted once (via <PushNotificationsGate/>) inside AuthProvider.
import { useEffect, useRef } from "react";
import { router } from "expo-router";
import * as Notifications from "expo-notifications";
import { useAuth } from "@/lib/auth";
import { registerPushToken } from "@/lib/api/endpoints";
import {
  pushPlatform,
  registerForPushNotificationsAsync,
  routeForPush,
  setPendingRoute,
  takePendingRoute,
} from "./register";

export function usePushNotifications() {
  const { user } = useAuth();
  const userId = user?.id;

  // Keep a live view of auth state for the tap listener (which mounts once).
  const userIdRef = useRef<string | undefined>(userId);
  userIdRef.current = userId;

  // ── Token registration ──
  // On every sign-in, (re)acquire the Expo token and hand it to the backend so
  // it can target this user's devices.
  useEffect(() => {
    if (!userId) return;
    let active = true;
    (async () => {
      const token = await registerForPushNotificationsAsync();
      if (!active || !token) return;
      try {
        await registerPushToken(token, pushPlatform());
      } catch {
        // Best-effort: a failed register just means no pushes until next launch.
      }
      // A tap that arrived before we were authenticated gets honored now.
      const pending = takePendingRoute();
      if (pending) router.push(pending as any);
    })();
    return () => {
      active = false;
    };
  }, [userId]);

  // ── Tap handling ──
  // Mounted once. Navigates on tap when signed in; otherwise stashes the route
  // for the registration effect to replay after login.
  useEffect(() => {
    const open = (data: unknown) => {
      const route = routeForPush(data);
      if (!route) return;
      if (userIdRef.current) router.push(route as any);
      else setPendingRoute(route);
    };

    // Cold start: the app was launched by tapping a notification.
    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (response) open(response.notification.request.content.data);
    });

    // Foreground/background taps.
    const sub = Notifications.addNotificationResponseReceivedListener((response) => {
      open(response.notification.request.content.data);
    });
    return () => sub.remove();
  }, []);
}
