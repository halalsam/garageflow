import { Pressable, ScrollView, View } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Txt } from "@/components/ui/Txt";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SearchBar } from "@/components/ui/SearchBar";
import { Plate } from "@/components/ui/Plate";
import { Avatar } from "@/components/ui/Avatar";
import { Stepper } from "@/components/ui/Stepper";
import { Icon, type IconName } from "@/components/Icon";
import { cardShadow } from "@/lib/theme";
import { inr } from "@/lib/format";
function Field({ icon, value, dark }: { icon: IconName; value: string; dark?: boolean }) {
  return (
    <View className="flex-1 flex-row items-center rounded-[14px] bg-white px-[14px] py-[13px]" style={[cardShadow, { gap: 11 }]}>
      <Icon name={icon} size={18} color="#9CA3AF" />
      <Txt className={`font-${dark ? "bold" : "medium"} text-[14px] ${dark ? "text-ink" : "text-faint"}`}>{value}</Txt>
    </View>
  );
}

function TotalRow({ label, value, big }: { label: string; value: string; big?: boolean }) {
  return (
    <View className="flex-row items-center justify-between" style={big ? { marginTop: 5 } : { marginTop: 3 }}>
      <Txt className={big ? "font-black text-[16px]" : "font-medium text-[12px] text-muted"}>{label}</Txt>
      <Txt className={big ? "font-black text-[16px]" : "font-medium text-[12px] text-muted"}>{value}</Txt>
    </View>
  );
}

export default function NewJobCard() {
  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-bg">
      <View className="flex-row items-center justify-between px-[18px] pb-[10px] pt-[6px]">
        <Txt className="font-black text-[21px]" style={{ letterSpacing: -0.5 }}>
          New Job Card
        </Txt>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Icon name="x" size={21} weight="bold" color="#6B7280" />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 16 }}>
        <View style={{ gap: 10 }}>
          <View className="flex-row items-center justify-between rounded-full bg-white px-[18px] py-[13px]" style={cardShadow}>
            <View className="flex-row items-center" style={{ gap: 10 }}>
              <Icon name="search" size={19} color="#9CA3AF" />
              <Txt className="font-medium text-[14px] text-faint">Vehicle / plate</Txt>
            </View>
            <Plate number="DL 3C AT 7788" scale={0.82} />
          </View>
          <View className="flex-row" style={{ gap: 10 }}>
            <Field icon="gauge" value="Odometer km" />
            <Field icon="user" value="Rakesh K." dark />
          </View>
          <Field icon="user" value="Complaint: brakes squealing, soft pedal…" dark />
        </View>

        <View className="mt-[14px] flex-row items-center justify-between">
          <Txt className="font-bold text-[15px]">Line items</Txt>
          <View className="flex-row items-center" style={{ gap: 4 }}>
            <Icon name="plus" size={14} weight="bold" color="#FF5A1F" />
            <Txt className="font-bold text-[13px] text-orange">Add</Txt>
          </View>
        </View>

        <Card className="mt-[10px] p-[12px]" style={{ gap: 10 }}>
          <View className="flex-row items-center justify-between">
            <View>
              <Txt className="font-bold text-[13px]">Brake pad replacement</Txt>
              <Txt className="mt-[4px] font-medium text-[11px] text-muted">Labour · catalogue</Txt>
            </View>
            <Txt className="font-bold text-[13px]">{inr(1800)}</Txt>
          </View>
          <View className="flex-row items-center justify-between border-t border-line pt-[10px]">
            <View className="flex-1">
              <Txt className="font-bold text-[13px]">Front brake pads</Txt>
              <View className="mt-[4px] self-start">
                <Stepper value={2} />
              </View>
            </View>
            <Txt className="font-bold text-[13px]">{inr(4800)}</Txt>
          </View>
        </Card>
      </ScrollView>

      {/* totals */}
      <View className="border-t border-[#F0F0F2] bg-white px-[18px] py-[12px]">
        <TotalRow label="Subtotal" value={inr(12034)} />
        <TotalRow label="GST 18%" value={inr(2166)} />
        <TotalRow label="Total" value={inr(14200)} big />
      </View>

      {/* assign + submit */}
      <View className="border-t border-[#F0F0F2] bg-white px-[16px] pb-[16px] pt-[14px]" style={{ shadowColor: "#281E14", shadowOpacity: 0.06, shadowRadius: 16, shadowOffset: { width: 0, height: -4 } }}>
        <View className="flex-row items-center" style={{ gap: 10 }}>
          <View className="flex-row items-center" style={{ gap: 6 }}>
            <Avatar initials="AP" color="a" size={28} />
            <View className="h-[28px] w-[28px] items-center justify-center rounded-full bg-line">
              <Icon name="plus" size={14} weight="bold" color="#FF5A1F" />
            </View>
          </View>
          <Button label="Send for my review" icon="paper-plane-tilt" small className="flex-1" onPress={() => router.back()} />
        </View>
      </View>
    </SafeAreaView>
  );
}
