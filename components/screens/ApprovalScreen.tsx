import { ScrollView, View } from "react-native";
import { Screen } from "@/components/ui/Screen";
import { TopBar } from "@/components/ui/TopBar";
import { Txt } from "@/components/ui/Txt";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Plate } from "@/components/ui/Plate";
import { CarThumb } from "@/components/ui/CarThumb";
import { Avatar } from "@/components/ui/Avatar";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SystemPill } from "@/components/chat/Chat";
import { Icon } from "@/components/Icon";
import { getApproval, inr } from "@/data/mock";

export function ApprovalScreen({ id, back }: { id?: string; back?: boolean }) {
  const approval = getApproval(id);
  return (
    <Screen>
      <TopBar
        title="Approval"
        back={back}
        right={<Badge label="REVIEW" tone="purple" />}
      />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 28 }}>
        <Card className="flex-row items-center p-[11px]" style={{ gap: 12 }}>
          <CarThumb width={54} height={54} radius={12} iconSize={24} />
          <View className="flex-1">
            <Plate number={approval.plate} scale={0.82} />
            <Txt className="mt-[5px] font-bold text-[14px]">
              {approval.car} · {approval.customer}
            </Txt>
            <View className="mt-[5px] flex-row items-center" style={{ gap: 6 }}>
              <Avatar initials={approval.submittedBy.initials} color={approval.submittedBy.color} size={16} />
              <Txt className="font-medium text-[12px] text-muted">
                Submitted by {approval.submittedBy.name.split(" ")[0]} · {approval.ago}
              </Txt>
            </View>
          </View>
        </Card>

        <View className="mt-[13px]">
          <SystemPill text="Pending manager review" tone="purple" />
        </View>

        <Card className="mt-[13px] p-[14px]">
          <View className="flex-row items-center justify-between">
            <SectionLabel>ESTIMATE</SectionLabel>
            <SectionLabel>QTY · AMOUNT</SectionLabel>
          </View>
          {approval.lines.map((l, i) => (
            <View key={i} className="flex-row items-start justify-between border-t border-line py-[9px]" style={i === 0 ? { borderTopWidth: 0 } : undefined}>
              <Txt className="font-medium text-[13px]">
                {l.label} <Txt className="text-[11px] text-muted">{l.note}</Txt>
              </Txt>
              <Txt className="font-bold text-[13px]">{inr(l.amount)}</Txt>
            </View>
          ))}
          <View className="flex-row items-center justify-between border-t border-line pt-[11px]">
            <Txt className="font-black text-[15px]">Total incl. GST</Txt>
            <Txt className="font-black text-[15px]">{inr(approval.total)}</Txt>
          </View>
        </Card>

        <View className="mt-[16px]">
          <SectionLabel>CONTACT CUSTOMER</SectionLabel>
          <View className="mt-[10px] flex-row" style={{ gap: 10 }}>
            <Button label="Call" variant="pur" icon="phone-call" className="flex-1" />
            <Button label="WhatsApp" variant="wa" icon="whatsapp" className="flex-1" />
          </View>
        </View>

        <View className="mt-[16px]">
          <SectionLabel>RECORD CUSTOMER DECISION</SectionLabel>
          <View className="mt-[10px] flex-row" style={{ gap: 10 }}>
            <Button label="Approve" variant="green" icon="check-circle" className="flex-1" />
            <Button label="Decline" variant="ghost" icon="x-circle" className="flex-1 border-[#FADADA]" textClassName="text-[#DC2626]" />
          </View>
          <View className="mt-[11px] flex-row items-center justify-center" style={{ gap: 5 }}>
            <Icon name="info" size={13} weight="fill" color="#6B7280" />
            <Txt className="text-[11px] text-muted">Customers never self-approve — you record it</Txt>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
