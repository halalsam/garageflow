import { useEffect, useState } from "react";
import { Keyboard, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Bottom padding for the composer row. While the keyboard is open the screen's
// KeyboardAvoidingView already lifts the row, so adding the nav-bar inset again
// would float the composer above the keyboard (visible while typing/recording).
export function useComposerInset() {
  const insets = useSafeAreaInsets();
  const [keyboardOpen, setKeyboardOpen] = useState(() => Keyboard.isVisible());

  useEffect(() => {
    const show = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      () => setKeyboardOpen(true),
    );
    const hide = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => setKeyboardOpen(false),
    );
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  if (keyboardOpen) return 9;
  return insets.bottom > 0 ? insets.bottom + 8 : 16;
}
