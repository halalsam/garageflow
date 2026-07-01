import { Platform } from "react-native";
import * as Haptics from "expo-haptics";

// Haptic vocabulary for the composer's recording gesture.
//
// WhatsApp itself does NOT chain generators like this — on iOS it authors a
// CHHapticPattern (Core Haptics) and on Android a VibrationEffect.createWaveform,
// each a single native waveform the OS schedules frame-accurately. expo-haptics
// only wraps the coarse generators (impact / notification / selection) and
// exposes neither pattern API, so the "rhythmic triple" below is approximated
// with JS-timed impacts. That is crisp on iOS but unreliable on Android (the
// engine merges/drops back-to-back impacts), so Android falls back to the single
// system Warning pattern. Swap this file for a native module if you ever need
// frame-accurate rhythm on both platforms.

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

// Event 1 — touch-down / long-press arm: sharp mechanical-switch pulse.
export const hArm = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

// Event 2 — boundary crossing: micro-tactile tick.
export const hTick = () => Haptics.selectionAsync();

// Event 3 — snap-to-lock: heavy confirmation.
export const hLock = () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

// Fired once a voice note is actually dispatched.
export const hSend = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

// Event 4 — swipe-to-cancel (trash slide): rhythmic failure triple-pulse.
// iOS gets three chained Heavy impacts timed with the trash-close visual;
// Android gets the single native Warning pattern.
export async function hCancel() {
  if (Platform.OS === "ios") {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    await wait(80);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    await wait(80);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    return;
  }
  await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
}
