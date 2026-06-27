import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { fmtDuration } from "@/components/chat/useChat";
import { usePostTimeline } from "@/lib/api/hooks/mutations";
import { qk } from "@/lib/api/queryClient";
import type { JobDetail, Person, TimelineItem } from "@/types/api";

// Clock label like the timeline ("9:05 AM").
function nowLabel() {
  const d = new Date();
  let h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${m} ${ampm}`;
}

// Infer a multipart file part from a local uri (RN FormData shape).
function filePart(uri: string, kind: "image" | "audio") {
  const ext = uri.split(".").pop()?.toLowerCase() ?? (kind === "image" ? "jpg" : "m4a");
  const type = kind === "image" ? `image/${ext === "jpg" ? "jpeg" : ext}` : `audio/${ext}`;
  return { uri, name: `${kind}.${ext}`, type } as unknown as Blob;
}

// API-backed chat store for a job timeline. Same interface as the old in-memory
// `useChat` (sendText/sendVoice/sendPhoto) so the Composer/ChatFeed are
// unchanged — but each send POSTs a multipart timeline entry and optimistically
// appends to the cached job detail so the feed updates instantly.
export function useJobChat(jobId: string, messages: TimelineItem[], me: Person) {
  const qc = useQueryClient();
  const post = usePostTimeline(jobId);

  // Optimistically append to the cached JobDetail.timeline.
  const optimistic = useCallback(
    (item: TimelineItem) => {
      qc.setQueryData<JobDetail>(qk.job(jobId), (prev) =>
        prev ? { ...prev, timeline: [...prev.timeline, item] } : prev,
      );
    },
    [qc, jobId],
  );

  const sendText = useCallback(
    (raw: string) => {
      const text = raw.trim();
      if (!text) return;
      optimistic({ kind: "text", by: me, text, time: nowLabel() });
      const form = new FormData();
      form.append("kind", "text");
      form.append("text", text);
      post.mutate(form);
    },
    [me, optimistic, post],
  );

  const sendVoice = useCallback(
    (uri: string, seconds: number) => {
      if (!uri || seconds < 1) return;
      optimistic({ kind: "voice", by: me, dur: fmtDuration(seconds), time: nowLabel(), uri });
      const form = new FormData();
      form.append("kind", "voice");
      form.append("durationMs", String(Math.round(seconds * 1000)));
      form.append("audio", filePart(uri, "audio") as any);
      post.mutate(form);
    },
    [me, optimistic, post],
  );

  const sendPhoto = useCallback(
    (uri: string) => {
      if (!uri) return;
      optimistic({ kind: "photo", by: me, time: nowLabel(), uri });
      const form = new FormData();
      form.append("kind", "photo");
      form.append("image", filePart(uri, "image") as any);
      post.mutate(form);
    },
    [me, optimistic, post],
  );

  return { messages, sendText, sendVoice, sendPhoto };
}
