import { ImageManipulator, SaveFormat } from "expo-image-manipulator";

// Longest edge after resize. 1600px keeps a scratch zoomable while cutting a
// 3–5MB camera frame down to ~200–400KB — the sweet spot for uploads on
// mobile data.
const MAX_EDGE = 1600;
const QUALITY = 0.6;

// One picked/captured photo, as ImagePicker returns it.
export type PickedPhoto = { uri: string; width?: number; height?: number };

// Downscale + recompress a photo before upload. Resizes the longest edge to
// MAX_EDGE (never upscales) and re-encodes as JPEG. Falls back to the original
// uri if manipulation fails — an oversized upload beats a lost photo.
export async function compressPhoto(photo: PickedPhoto): Promise<string> {
  try {
    const { uri, width = 0, height = 0 } = photo;
    const context = ImageManipulator.manipulate(uri);
    if (Math.max(width, height) > MAX_EDGE) {
      context.resize(width >= height ? { width: MAX_EDGE } : { height: MAX_EDGE });
    }
    const image = await context.renderAsync();
    const result = await image.saveAsync({ compress: QUALITY, format: SaveFormat.JPEG });
    return result.uri;
  } catch {
    return photo.uri;
  }
}
