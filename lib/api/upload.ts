import { uploadAsync, FileSystemUploadType } from "expo-file-system/legacy";
import * as e from "@/lib/api/endpoints";

// Guess a content-type from a local file uri (mirrors the logic in useJobEvents).
export function contentTypeFor(uri: string, kind: "image" | "audio"): string {
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

// Presign + PUT a local file to storage for one job, returning its public URL.
// Used for one-off uploads (e.g. the delivery voice note) outside the timeline
// send flow.
export async function uploadJobFile(
  jobId: string,
  uri: string,
  kind: "image" | "audio",
): Promise<string> {
  const contentType = contentTypeFor(uri, kind);
  const presigned = await e.presignUpload(jobId, contentType);
  await uploadAsync(presigned.uploadUrl, uri, {
    httpMethod: "PUT",
    uploadType: FileSystemUploadType.BINARY_CONTENT,
    headers: { "Content-Type": contentType, ...presigned.headers },
  });
  return presigned.fileUrl;
}
