// Seconds -> "m:ss" for voice-note durations. (The timeline store itself is now
// API-backed + realtime — see lib/api/hooks/useJobEvents.ts.)
export function fmtDuration(sec: number) {
  const m = Math.floor(sec / 60);
  const s = (sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}
