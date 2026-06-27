import { View } from "react-native";
import { Card } from "@/components/ui/Card";
import { Txt } from "@/components/ui/Txt";
import { Badge } from "@/components/ui/Badge";
import { Plate } from "@/components/ui/Plate";
import { Avatar } from "@/components/ui/Avatar";
import { CarThumb } from "@/components/ui/CarThumb";
import { Icon } from "@/components/Icon";
import { inr, type Approval } from "@/data/mock";

// One row in the Approvals list. Tapping it opens the approval detail.
export function ApprovalRow({ approval, onPress }: { approval: Approval; onPress: () => void }) {
  return (
    <Card className="flex-row items-center p-[11px]" style={{ gap: 11 }} onPress={onPress}>
      <CarThumb width={50} height={50} radius={12} iconSize={22} />
      <View className="flex-1">
        <View className="flex-row items-center justify-between">
          <Plate number={approval.plate} scale={0.72} />
          <Badge label="REVIEW" tone="purple" />
        </View>
        <Txt className="mt-[5px] font-bold text-[14px]">
          {approval.car} · <Txt className="font-bold text-[14px] text-orange">{inr(approval.total)}</Txt>
        </Txt>
        <View className="mt-[4px] flex-row items-center" style={{ gap: 6 }}>
          <Avatar initials={approval.submittedBy.initials} color={approval.submittedBy.color} size={16} />
          <Txt className="font-medium text-[12px] text-muted">
            {approval.submittedBy.name.split(" ")[0]} · {approval.ago}
          </Txt>
        </View>
      </View>
      <Icon name="caret-right" size={18} weight="bold" color="#C3C3CC" />
    </Card>
  );
}
