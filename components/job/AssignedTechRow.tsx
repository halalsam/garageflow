import { Pressable, View } from "react-native";
import { Txt } from "@/components/ui/Txt";
import { Avatar } from "@/components/ui/Avatar";
import { Icon } from "@/components/Icon";
import type { Person } from "@/types/api";

// Compact header row showing who's on the job; tapping opens AssignTechSheet.
// Rendered for managers only — techs can't reassign.
export function AssignedTechRow({ tech, onPress }: { tech?: Person; onPress: () => void }) {
  return (
    <Pressable
      className="mt-[8px] flex-row items-center rounded-[12px] bg-[#F4F4F6] px-[11px] py-[8px]"
      style={{ gap: 9 }}
      onPress={onPress}
    >
      {tech ? (
        <Avatar initials={tech.initials} color={tech.color} size={26} />
      ) : (
        <View className="h-[26px] w-[26px] items-center justify-center rounded-full bg-[#E4E4E9]">
          <Icon name="wrench" size={14} weight="bold" color="#6B7280" />
        </View>
      )}
      <Txt className="flex-1 font-bold text-[13px]">
        {tech ? tech.name : "Assign technician"}
      </Txt>
      <Icon name="caret-up-down" size={14} weight="bold" color="#9CA3AF" />
    </Pressable>
  );
}
