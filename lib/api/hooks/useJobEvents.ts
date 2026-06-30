import { useCallback, useEffect } from "react";
import { useInfiniteQuery, useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { uploadAsync, FileSystemUploadType } from "expo-file-system/legacy";
import * as e from "@/lib/api/endpoints";
import { qk } from "@/lib/api/queryClient";
import { getSocket, joinJob, leaveJob } from "@/lib/realtime/socket";
import type { JobEvent, JobEventsPage, JobEventStatus, Person } from "@/types/api";

const PAGE = 30;

type Cache = InfiniteData<JobEventsPage, string | undefined>;

// Clock label matching the server's formatTime ("9:05 AM"), used for optimistic
// bubbles until the real event arrives.
function nowLabel(): string {
  const d = new Date();
  let h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${m} ${ampm}`;
}

const tmpId = () => `tmp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

// Guess a content-type from a local file uri so the presign + PUT carry the
// right header (S3 stores it; the app sends it back on the event).
function contentTypeFor(uri: string, kind: "image" | "audio"): string {
  const ext = uri.split("?")[0].split(".").pop()?.toLowerCase() ?? "";
  if (kind === "image") {
    if (ext === "png") return "image/png";
    if (ext === "webp") return "image/webp";
    if (ext === "heic") return "image/heic";
    return "image/jpeg";
  }
  if (ext === "mp3") return "audio/mpeg";
  if (ext === "aac") return "audio/aac";
  if (ext === "webm") return "audio/webm";
  return "audio/m4a";
}

// API-backed, realtime event store for one job's timeline. Reads page-by-page
// (newest-first cursor) for upward infinite scroll; joins the socket room on
// mount and reconciles optimistic sends against the server echo. Same outward
// shape as the old useJobChat (sendText/sendVoice/sendPhoto) so the Composer is
// unchanged.
export function useJobEvents(code: string, me: Person) {
  const qc = useQueryClient();
  const key = qk.jobEvents(code);

  const query = useInfiniteQuery({
    queryKey: key,
    queryFn: ({ pageParam, signal }) =>
      e.fetchJobEvents(code, { cursor: pageParam, limit: PAGE }, signal),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => last.nextCursor ?? undefined,
    enabled: !!code,
  });

  // Flattened newest-first: index 0 is the newest event (rendered at the bottom
  // of the inverted list), older events follow.
  const events: JobEvent[] = query.data?.pages.flatMap((p) => p.items) ?? [];

  // ── Cache mutators ─────────────────────────────────────────────────────────
  const prepend = useCallback(
    (ev: JobEvent) => {
      qc.setQueryData<Cache>(key, (prev) => {
        if (!prev) {
          return { pages: [{ items: [ev], nextCursor: null }], pageParams: [undefined] };
        }
        const [first, ...rest] = prev.pages;
        return { ...prev, pages: [{ ...first, items: [ev, ...first.items] }, ...rest] };
      });
    },
    [qc, key],
  );

  const replaceByClientId = useCallback(
    (clientId: string, ev: JobEvent) => {
      qc.setQueryData<Cache>(key, (prev) =>
        prev
          ? {
              ...prev,
              pages: prev.pages.map((pg) => ({
                ...pg,
                items: pg.items.map((it) => (it.clientId === clientId ? ev : it)),
              })),
            }
          : prev,
      );
    },
    [qc, key],
  );

  const setStatus = useCallback(
    (clientId: string, status: JobEventStatus) => {
      qc.setQueryData<Cache>(key, (prev) =>
        prev
          ? {
              ...prev,
              pages: prev.pages.map((pg) => ({
                ...pg,
                items: pg.items.map((it) => (it.clientId === clientId ? { ...it, status } : it)),
              })),
            }
          : prev,
      );
    },
    [qc, key],
  );

  // ── Incoming socket events ───────────────────────────────────────────────────
  useEffect(() => {
    if (!code) return;
    const socket = getSocket();
    joinJob(code);

    const onEvent = (ev: JobEvent) => {
      const cache = qc.getQueryData<Cache>(key);
      const items = cache?.pages.flatMap((p) => p.items) ?? [];
      // Dedup: already have this server id → ignore (covers our own echo too).
      if (items.some((it) => it.id === ev.id)) return;
      // Our own optimistic message coming back → reconcile in place.
      if (ev.clientId && items.some((it) => it.clientId === ev.clientId)) {
        replaceByClientId(ev.clientId, { ...ev, status: "sent" });
        return;
      }
      prepend(ev);
    };

    socket.on("event", onEvent);
    return () => {
      socket.off("event", onEvent);
      leaveJob(code);
    };
  }, [code, qc, key, prepend, replaceByClientId]);

  // ── Sends (optimistic) ───────────────────────────────────────────────────────
  const sendText = useCallback(
    (raw: string) => {
      const text = raw.trim();
      if (!text) return;
      const clientId = tmpId();
      prepend({
        type: "COMMENT",
        id: clientId,
        clientId,
        by: me,
        body: text,
        createdAt: new Date().toISOString(),
        time: nowLabel(),
        status: "sending",
      });
      e
        .postJobEvent(code, { type: "COMMENT", body: text, clientId })
        .then((ev) => replaceByClientId(clientId, { ...ev, status: "sent" }))
        .catch(() => setStatus(clientId, "failed"));
    },
    [code, me, prepend, replaceByClientId, setStatus],
  );

  // PUT a local file to a presigned URL and return the public file URL. The file
  // is uploaded directly to storage — it never crosses the socket.
  const uploadFile = useCallback(
    async (uri: string, contentType: string): Promise<string> => {
      const presigned = await e.presignUpload(code, contentType);
      await uploadAsync(presigned.uploadUrl, uri, {
        httpMethod: "PUT",
        uploadType: FileSystemUploadType.BINARY_CONTENT,
        headers: { "Content-Type": contentType, ...presigned.headers },
      });
      return presigned.fileUrl;
    },
    [code],
  );

  const sendPhoto = useCallback(
    (uri: string) => {
      if (!uri) return;
      const clientId = tmpId();
      prepend({
        type: "PHOTO",
        id: clientId,
        clientId,
        by: me,
        payload: { url: uri }, // local uri renders instantly; swapped on echo
        createdAt: new Date().toISOString(),
        time: nowLabel(),
        status: "sending",
      });
      (async () => {
        const url = await uploadFile(uri, contentTypeFor(uri, "image"));
        const ev = await e.postJobEvent(code, { type: "PHOTO", payload: { url }, clientId });
        replaceByClientId(clientId, { ...ev, status: "sent" });
      })().catch(() => setStatus(clientId, "failed"));
    },
    [code, me, prepend, replaceByClientId, setStatus, uploadFile],
  );

  const sendVoice = useCallback(
    (uri: string, seconds: number) => {
      if (!uri || seconds < 1) return;
      const clientId = tmpId();
      const durationMs = Math.round(seconds * 1000);
      prepend({
        type: "VOICE",
        id: clientId,
        clientId,
        by: me,
        payload: { url: uri, durationMs },
        createdAt: new Date().toISOString(),
        time: nowLabel(),
        status: "sending",
      });
      (async () => {
        const url = await uploadFile(uri, contentTypeFor(uri, "audio"));
        const ev = await e.postJobEvent(code, {
          type: "VOICE",
          payload: { url, durationMs },
          clientId,
        });
        replaceByClientId(clientId, { ...ev, status: "sent" });
      })().catch(() => setStatus(clientId, "failed"));
    },
    [code, me, prepend, replaceByClientId, setStatus, uploadFile],
  );

  return {
    events,
    sendText,
    sendPhoto,
    sendVoice,
    loadOlder: query.fetchNextPage,
    hasMore: !!query.hasNextPage,
    loadingMore: query.isFetchingNextPage,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}
