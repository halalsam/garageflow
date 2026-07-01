import { useCallback, useRef, useState } from "react";
import { Gesture } from "react-native-gesture-handler";
import {
  cancelAnimation,
  Easing,
  runOnJS,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { hArm, hCancel, hLock, hSend, hTick } from "@/components/chat/composerHaptics";
import { useVoiceRecorder } from "@/components/chat/useVoiceRecorder";

// ─── State machine ────────────────────────────────────────────────────────
// Idle      → empty field, mic shown, no gesture in flight
// Typing    → field has text, send button shown
// Recording → finger held down past the long-press threshold, capturing audio
// Locked    → hands-free; finger lifted but recording continues
// Canceling → finger dragged left past the cancel line; release discards
export type ComposerState = "Idle" | "Typing" | "Recording" | "Locked" | "Canceling";
type RecState = "Recording" | "Locked" | "Canceling";

// ─── Gesture geometry (dp) ────────────────────────────────────────────────
const LONG_PRESS_MS = 400; // sustained touch before recording arms
const CANCEL_DX = -60; // drag-left distance that arms cancel
const LOCK_DY = -40; // drag-up distance that snaps to hands-free lock
const MIC_FOLLOW_MIN = -160; // furthest the floating mic trails the finger
const LOCK_TRAVEL_MAX = -72; // furthest the lock chip lifts with the finger

// WhatsApp's grow/shrink: a fast ease-out with no overshoot (their standard
// cubic-bezier(0.2, 0, 0, 1) swap curve), unlike a bouncy spring.
const GROW = { duration: 180, easing: Easing.bezier(0.2, 0, 0, 1) };

export type ComposerGesture = ReturnType<typeof useComposerGesture>;

export function useComposerGesture({
  hasText,
  onTapMic,
  onSendVoice,
}: {
  hasText: boolean;
  onTapMic?: () => void;
  onSendVoice?: (uri: string, seconds: number) => void;
}) {
  const rec = useVoiceRecorder();

  // The single source of truth the UI renders from, driven by JS-thread
  // callbacks marshalled out of the gesture worklets via runOnJS.
  const [recState, setRecState] = useState<RecState>("Recording");
  const [active, setActive] = useState(false); // any recording lifecycle on screen

  // Reanimated values shared with the worklets — never read on the JS thread.
  const translateX = useSharedValue(0); // mic horizontal follow
  const translateY = useSharedValue(0); // lock-chip vertical follow
  const micScale = useSharedValue(1); // floating mic grow on arm

  // Worklet-side latches so haptics fire exactly once per boundary crossing.
  const recording = useSharedValue(false); // long press has armed
  const cancelArmed = useSharedValue(false);
  const lockArmed = useSharedValue(false);

  // Refs let the JS finalisers read the freshest values without re-creating
  // the gesture objects on every render.
  const durationRef = useRef(0);
  durationRef.current = rec.durationMillis;
  const cbRef = useRef({ onTapMic, onSendVoice, start: rec.start, stop: rec.stop });
  cbRef.current = { onTapMic, onSendVoice, start: rec.start, stop: rec.stop };

  // Restore the rest position of every animated value + latch.
  const settle = useCallback(() => {
    "worklet";
    translateX.value = withSpring(0, { damping: 18, stiffness: 220 });
    translateY.value = withSpring(0, { damping: 18, stiffness: 220 });
    micScale.value = withTiming(1, GROW);
    recording.value = false;
    cancelArmed.value = false;
    lockArmed.value = false;
  }, [translateX, translateY, micScale, recording, cancelArmed, lockArmed]);

  // ── Recording lifecycle (JS thread) ──
  const beginRecording = useCallback(async () => {
    const ok = await cbRef.current.start();
    if (!ok) {
      setActive(false);
      settle(); // permission denied / failed to arm → unwind cleanly
      return;
    }
    setRecState("Recording");
    setActive(true);
    hArm();
  }, [settle]);

  // Stop and decide: send, or discard. `discard` short-circuits sending.
  const endRecording = useCallback(
    async (discard: boolean) => {
      const seconds = Math.round(durationRef.current / 1000);
      const uri = await cbRef.current.stop();
      setActive(false);
      setRecState("Recording");
      settle();
      if (!discard && uri && seconds >= 1) {
        hSend();
        cbRef.current.onSendVoice?.(uri, seconds);
      }
    },
    [settle],
  );

  const promoteToLocked = useCallback(() => setRecState("Locked"), []);
  const setCanceling = useCallback((c: boolean) => setRecState(c ? "Canceling" : "Recording"), []);

  // Imperative controls for the locked bar (buttons, not gestures).
  const sendLocked = useCallback(() => endRecording(false), [endRecording]);
  const cancelLocked = useCallback(() => {
    hCancel();
    endRecording(true);
  }, [endRecording]);
  const tapMic = useCallback(() => {
    hTick();
    cbRef.current.onTapMic?.();
  }, []);

  // ── Long press: arms recording after LONG_PRESS_MS of sustained touch ──
  // Native timing, so no timers live inside a worklet.
  const longPress = Gesture.LongPress()
    .minDuration(LONG_PRESS_MS)
    .maxDistance(1e4) // never cancel on movement — the Pan handles drift
    .onStart(() => {
      "worklet";
      recording.value = true;
      micScale.value = withTiming(2, GROW);
      runOnJS(beginRecording)();
    })
    .onFinalize(() => {
      "worklet";
      if (!recording.value) {
        // Released before the threshold → it was a tap, not a hold.
        runOnJS(tapMic)();
      }
    });

  // ── Pan: tracks drag once recording is armed, resolves cancel/lock/send ──
  const pan = Gesture.Pan()
    .minDistance(0)
    .onBegin(() => {
      "worklet";
      cancelAnimation(translateX);
      cancelAnimation(translateY);
      translateX.value = 0;
      translateY.value = 0;
    })
    .onUpdate((e) => {
      "worklet";
      if (!recording.value || lockArmed.value) return; // idle, or already locked

      // Horizontal: trail the mic left, arm cancel past the line.
      translateX.value = Math.min(0, Math.max(MIC_FOLLOW_MIN, e.translationX));
      const nowCancel = e.translationX < CANCEL_DX;
      if (nowCancel !== cancelArmed.value) {
        cancelArmed.value = nowCancel;
        runOnJS(setCanceling)(nowCancel);
        runOnJS(hTick)(); // micro-tick on boundary crossing
      }

      // Vertical: lift the lock chip, snap to lock past the line.
      translateY.value = Math.min(0, Math.max(LOCK_TRAVEL_MAX, e.translationY));
      if (!cancelArmed.value && e.translationY < LOCK_DY) {
        lockArmed.value = true;
        translateX.value = withSpring(0, { damping: 18, stiffness: 220 });
        translateY.value = withSpring(0, { damping: 18, stiffness: 220 });
        micScale.value = withTiming(1, GROW);
        runOnJS(hLock)(); // heavy confirmation pulse
        runOnJS(promoteToLocked)();
      }
    })
    .onFinalize(() => {
      "worklet";
      if (!recording.value) return; // never armed → nothing to resolve
      if (lockArmed.value) return; // hands-free: recording stays alive
      const discard = cancelArmed.value;
      if (discard) runOnJS(hCancel)();
      runOnJS(endRecording)(discard);
    });

  // Both run together: long press owns timing, pan owns tracking.
  const gesture = Gesture.Simultaneous(longPress, pan);

  const state: ComposerState = active ? recState : hasText ? "Typing" : "Idle";

  return {
    state,
    active,
    recState,
    gesture,
    anim: { translateX, translateY, micScale },
    durationMillis: rec.durationMillis,
    sendLocked,
    cancelLocked,
  };
}

export { LONG_PRESS_MS, CANCEL_DX, LOCK_DY };
