import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { compressPhoto } from "./compress";

// Get a compressed local JPEG from the camera or the photo library (asking
// permission first). Resolves null if the user denies or cancels.
export async function photoFrom(source: "camera" | "library"): Promise<string | null> {
  if (source === "camera") {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("Camera access needed", "Enable camera permission to take photos.");
      return null;
    }
    const res = await ImagePicker.launchCameraAsync({ mediaTypes: ["images"], quality: 0.7 });
    if (res.canceled || !res.assets?.[0]) return null;
    return compressPhoto(res.assets[0]);
  }
  const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!perm.granted) return null;
  const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], quality: 0.7 });
  if (res.canceled || !res.assets?.[0]) return null;
  return compressPhoto(res.assets[0]);
}

// Let the user pick a source, then hand the compressed uri to `use`.
export function pickPhotoSource(use: (uri: string) => void, title = "Add photo") {
  const from = (source: "camera" | "library") => async () => {
    const uri = await photoFrom(source);
    if (uri) use(uri);
  };
  Alert.alert(title, undefined, [
    { text: "Take Photo", onPress: from("camera") },
    { text: "Choose from Library", onPress: from("library") },
    { text: "Cancel", style: "cancel" },
  ]);
}
