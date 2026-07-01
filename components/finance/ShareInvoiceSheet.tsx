import { useState } from "react";
import { Image, Pressable, Switch, View } from "react-native";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Txt } from "@/components/ui/Txt";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/Icon";
import type { CompletionPhoto } from "@/types/api";

// Share options for an invoice PDF. The customer usually just gets the bill;
// flipping the switch appends the vehicle's before (workshop) and after
// (delivery) walk-around photos as proof of condition.
export function ShareInvoiceSheet({
  visible,
  before,
  after,
  sharing,
  onClose,
  onShare,
}: {
  visible: boolean;
  before: CompletionPhoto[];
  after: CompletionPhoto[];
  sharing?: boolean;
  onClose: () => void;
  onShare: (includePhotos: boolean) => void;
}) {
  const [includePhotos, setIncludePhotos] = useState(false);
  const count = before.length + after.length;

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View className="px-[18px] pb-[24px] pt-[8px]">
        <View className="flex-row items-center justify-between">
          <Txt className="font-bold text-[18px]" style={{ letterSpacing: -0.3 }}>
            Share invoice
          </Txt>
          <Pressable onPress={onClose} hitSlop={10}>
            <Icon name="x" size={20} weight="bold" color="#6B7280" />
          </Pressable>
        </View>

        <View className="mt-[16px] flex-row items-center justify-between rounded-[14px] bg-[#F4F4F6] px-[14px] py-[12px]">
          <View className="flex-1 pr-[10px]">
            <Txt className="font-bold text-[14px]">Attach before & after photos</Txt>
            <Txt className="mt-[2px] font-medium text-[12px] text-muted">
              {count} vehicle condition photo{count === 1 ? "" : "s"} added to the PDF
            </Txt>
          </View>
          <Switch
            value={includePhotos}
            onValueChange={setIncludePhotos}
            trackColor={{ true: "#FF5A1F" }}
          />
        </View>

        {includePhotos ? <PhotoStrip before={before} after={after} /> : null}

        <Button
          label={sharing ? "Preparing…" : "Share"}
          icon="export"
          className="mt-[16px]"
          disabled={sharing}
          onPress={() => onShare(includePhotos)}
        />
      </View>
    </BottomSheet>
  );
}

// A small preview of what rides along, so the sender knows what the customer
// will see before the share sheet opens.
function PhotoStrip({ before, after }: { before: CompletionPhoto[]; after: CompletionPhoto[] }) {
  const rows: { label: string; photos: CompletionPhoto[] }[] = [
    { label: "Before", photos: before },
    { label: "After", photos: after },
  ];
  return (
    <View className="mt-[10px]" style={{ gap: 8 }}>
      {rows.map(({ label, photos }) =>
        photos.length ? (
          <View key={label} className="flex-row items-center" style={{ gap: 6 }}>
            <Txt className="w-[48px] font-bold text-[11px] text-muted">{label}</Txt>
            {photos.map((p) => (
              <Image
                key={p.side}
                source={{ uri: p.uri }}
                style={{ width: 44, height: 44, borderRadius: 8 }}
              />
            ))}
          </View>
        ) : null,
      )}
    </View>
  );
}
