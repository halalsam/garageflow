// Seconds -> "m:ss" for voice-note durations. (The chat store itself is now
// API-backed — see lib/api/hooks/useJobChat.ts.)
export function fmtDuration(sec: number) {
  const m = Math.floor(sec / 60);
  const s = (sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}
