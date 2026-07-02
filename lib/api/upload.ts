import { File } from "expo-file-system";
import { uploadAsync, FileSystemUploadType } from "expo-file-system/legacy";
import * as e from "@/lib/api/endpoints";

// Build a multipart form around one local photo. SDK 56's global fetch is
// expo/fetch, whose FormData rejects React Native's { uri, name, type } file
// parts ("Unsupported FormDataPart implementation") — wrap the local uri in a
// Blob-compatible File instead; filename and content-type come from the File.
export function photoForm(uri: string, fields: Record<string, string> = {}): FormData {
  const form = new FormData();
  for (const [key, value] of Object.entries(fields)) form.append(key, value);
  form.append("image", new File(uri) as unknown as Blob);
  return form;
}

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
