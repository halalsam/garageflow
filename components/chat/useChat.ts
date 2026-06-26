import { useCallback, useState } from "react";
import type { Person, TimelineItem } from "@/data/mock";

// Clock label like the mock timeline ("9:05 AM").
function nowLabel() {
  const d = new Date();
  let h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${m} ${ampm}`;
}

// Seconds -> "m:ss" for voice-note durations.
export function fmtDuration(sec: number) {
  const m = Math.floor(sec / 60);
  const s = (sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

// Local-state chat store for a job timeline. Seeds with the mock feed and
// appends new messages authored by `me`. No backend — purely in-memory.
export function useChat(initial: TimelineItem[], me: Person) {
  const [messages, setMessages] = useState<TimelineItem[]>(initial);

  const sendText = useCallback(
    (raw: string) => {
      const text = raw.trim();
      if (!text) return;
      setMessages((prev) => [...prev, { kind: "text", by: me, text, time: nowLabel() }]);
    },
    [me],
  );

  const sendVoice = useCallback(
    (seconds: number) => {
      if (seconds < 1) return;
      setMessages((prev) => [
        ...prev,
        { kind: "voice", by: me, dur: fmtDuration(seconds), time: nowLabel() },
      ]);
    },
    [me],
  );

  return { messages, sendText, sendVoice };
}
