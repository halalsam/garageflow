import { Pressable, View } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";
import { Icon } from "@/components/Icon";
import type { ComposerGesture } from "@/components/chat/useComposerGesture";

// WhatsApp's swap easing: cubic-bezier(0.2, 0, 0, 1.0).
const SWAP = { duration: 150, easing: Easing.bezier(0.2, 0, 0, 1.0) };

// The floating action button that swaps Mic ⇄ Send and hosts the hold-to-record
// gesture. When `hasText` is true it morphs to the send arrow (150ms scale +
// rotate); otherwise it's a 56dp mic circle wired to the recording gesture.
export function MicSendButton({
  hasText,
  recording,
  gc,
  onSend,
}: {
  hasText: boolean;
  recording: boolean; // finger-held recording in flight (grows + turns red)
  gc: ComposerGesture;
  onSend: () => void;
}) {
  // 0 = mic, 1 = send. Drives the cross-fade / rotate swap.
  const swap = useDerivedValue(() => withTiming(hasText ? 1 : 0, SWAP), [hasText]);

  const micStyle = useAnimatedStyle(() => ({
    opacity: interpolate(swap.value, [0, 1], [1, 0]),
    transform: [
      { scale: interpolate(swap.value, [0, 1], [1, 0.4]) * gc.anim.micScale.value },
      { rotate: `${interpolate(swap.value, [0, 1], [0, -90])}deg` },
      { translateX: gc.anim.translateX.value },
    ],
  }));

  const sendStyle = useAnimatedStyle(() => ({
    opacity: interpolate(swap.value, [0, 1], [0, 1]),
    transform: [
      { scale: interpolate(swap.value, [0, 1], [0.4, 1]) },
      { rotate: `${interpolate(swap.value, [0, 1], [90, 0])}deg` },
    ],
  }));

  // Lock affordance that lifts with the finger while dragging up.
  const lockStyle = useAnimatedStyle(() => ({
    opacity: recording ? interpolate(gc.anim.translateY.value, [-40, 0], [1, 0.35], "clamp") : 0,
    transform: [{ translateY: gc.anim.translateY.value - 60 }],
  }));

  return (
    <View className="items-center justify-center" style={{ width: 56, height: 56 }}>
      {/* Swipe-up-to-lock hint, floats above the mic during recording. */}
      <Animated.View pointerEvents="none" style={[{ position: "absolute" }, lockStyle]}>
        <View className="h-[34px] w-[34px] items-center justify-center rounded-full bg-white" style={LOCK_SHADOW}>
          <Icon name="lock-simple" size={16} weight="bold" color="#6C2BD9" />
        </View>
      </Animated.View>

      {hasText ? (
        // Text present → plain tap-to-send, no recording gesture.
        <Pressable
          onPress={onSend}
          className="h-[48px] w-[48px] items-center justify-center rounded-full bg-orange active:opacity-80"
        >
          <Animated.View style={sendStyle}>
            <Icon name="paper-plane-tilt" size={20} weight="fill" color="#fff" />
          </Animated.View>
        </Pressable>
      ) : (
        <GestureDetector gesture={gc.gesture}>
          <Animated.View
            style={[
              {
                width: 56,
                height: 56,
                borderRadius: 28,
                alignItems: "center",
                justifyContent: "center",
              },
              micStyle,
            ]}
            className={recording ? "bg-[#EF4444]" : "bg-orange"}
          >
            <Icon name="microphone" size={24} weight="fill" color="#fff" />
          </Animated.View>
        </GestureDetector>
      )}
    </View>
  );
}

const LOCK_SHADOW = {
  shadowColor: "#281E14",
  shadowOpacity: 0.14,
  shadowRadius: 6,
  shadowOffset: { width: 0, height: 2 },
  elevation: 4,
} as const;
