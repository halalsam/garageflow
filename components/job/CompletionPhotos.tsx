import { Image, Pressable, View } from "react-native";
import { Card } from "@/components/ui/Card";
import { Txt } from "@/components/ui/Txt";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/Icon";
import { COMPLETION_SIDES, type CompletionPhoto, type CompletionSide } from "@/types/api";

const LABELS: Record<CompletionSide, string> = {
  front: "Front",
  back: "Back",
  left: "Left",
  right: "Right",
};

// Mandatory walk-around photos captured at completion. Technicians capture each
// side (camera); everyone can review the gallery and send it to the customer.
export function CompletionPhotos({
  photos,
  canCapture,
  busySide,
  onCapture,
  onSend,
}: {
  photos: CompletionPhoto[];
  canCapture: boolean;
  busySide?: CompletionSide | null;
  onCapture: (side: CompletionSide) => void;
  onSend: () => void;
}) {
  const bySide = new Map(photos.map((p) => [p.side, p.uri]));
  const have = COMPLETION_SIDES.filter((s) => bySide.has(s)).length;
  const complete = have === COMPLETION_SIDES.length;

  // Hide entirely for non-technicians until at least one photo exists.
  if (!canCapture && have === 0) return null;

  return (
    <Card className="mt-[11px] p-[13px]">
      <View className="mb-[10px] flex-row items-center justify-between">
        <Txt className="font-bold text-[13px]">Completion photos</Txt>
        <Txt className={`font-bold text-[11px] ${complete ? "text-[#16A34A]" : "text-muted"}`}>
          {have}/{COMPLETION_SIDES.length}
        </Txt>
      </View>

      <View className="flex-row" style={{ gap: 8 }}>
        {COMPLETION_SIDES.map((side) => {
          const uri = bySide.get(side);
          const busy = busySide === side;
          const tappable = canCapture && !busy;
          return (
            <Pressable
              key={side}
              className="flex-1"
              disabled={!tappable}
              onPress={() => onCapture(side)}
              style={{ opacity: busy ? 0.5 : 1 }}
            >
              <View
                className="items-center justify-center overflow-hidden rounded-[10px] bg-[#F3F4F6]"
                style={{ aspectRatio: 1, borderWidth: uri ? 0 : 1, borderColor: "#E5E7EB", borderStyle: "dashed" }}
              >
                {uri ? (
                  <Image source={{ uri }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
                ) : (
                  <Icon name={canCapture ? "camera" : "image"} size={18} color="#9CA3AF" weight="regular" />
                )}
              </View>
              <Txt className="mt-[4px] text-center font-medium text-[10px] text-muted">{LABELS[side]}</Txt>
            </Pressable>
          );
        })}
      </View>

      {complete ? (
        <Button label="Send to customer" variant="wa" icon="paper-plane-tilt" small className="mt-[11px]" onPress={onSend} />
      ) : canCapture ? (
        <Txt className="mt-[10px] text-center font-medium text-[11px] text-muted">
          Capture all four sides to complete the job.
        </Txt>
      ) : null}
    </Card>
  );
}
