// Native side of exporting reports: write the generated string to a cache file
// and open the share sheet. Uses the SDK 56 file-system File API.
import { Alert } from "react-native";
import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as Print from "expo-print";

function writeCacheFile(name: string, content: string): string {
  const file = new File(Paths.cache, name);
  try {
    if (file.exists) file.delete();
  } catch {
    // nothing to clean up
  }
  file.create();
  file.write(content);
  return file.uri;
}

async function ensureSharing(): Promise<boolean> {
  if (await Sharing.isAvailableAsync()) return true;
  Alert.alert("Sharing unavailable", "This device can't open the share sheet.");
  return false;
}

// Share a CSV (opens in Excel / Google Sheets / accounting apps).
export async function shareCsv(filename: string, csv: string) {
  if (!(await ensureSharing())) return;
  const uri = writeCacheFile(filename, csv);
  await Sharing.shareAsync(uri, {
    mimeType: "text/csv",
    UTI: "public.comma-separated-values-text",
    dialogTitle: filename,
  });
}

// Render HTML to a PDF and share it.
export async function sharePdf(dialogTitle: string, html: string) {
  const { uri } = await Print.printToFileAsync({ html });
  if (!(await ensureSharing())) return;
  await Sharing.shareAsync(uri, { mimeType: "application/pdf", UTI: "com.adobe.pdf", dialogTitle });
}
