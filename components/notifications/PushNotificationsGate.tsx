import { usePushNotifications } from "@/lib/notifications/usePushNotifications";

// Behavior-only mount point: wires push registration + tap routing into the
// tree. Renders nothing. Lives under AuthProvider so it can react to sign-in.
export function PushNotificationsGate() {
  usePushNotifications();
  return null;
}
