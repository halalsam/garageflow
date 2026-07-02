import { Alert, Pressable, ScrollView, View } from "react-native";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Txt } from "@/components/ui/Txt";
import { Avatar } from "@/components/ui/Avatar";
import { Icon } from "@/components/Icon";
import { Loading } from "@/components/ui/QueryState";
import { useTeam } from "@/lib/api/hooks/queries";
import { useUpdateJob } from "@/lib/api/hooks/mutations";
import type { Person } from "@/types/api";

// Manager-only: assign or reassign the technician on a job. Lists the team's
// active technicians; picking one PATCHes { techId } (the backend notifies the
// newly assigned tech). "Unassign" clears the field.
export function AssignTechSheet({
  jobId,
  current,
  visible,
  onClose,
}: {
  jobId: string;
  // The currently assigned tech, when the job has one.
  current?: Person;
  visible: boolean;
  onClose: () => void;
}) {
  const { data: team, isLoading } = useTeam();
  const updateJob = useUpdateJob(jobId);
  const techs = (team ?? []).filter((m) => m.role === "tech" && !m.inactive);

  // The backend maps an empty techId to null (unassigned).
  const assign = (techId: string) => {
    if (updateJob.isPending) return;
    updateJob.mutate(
      { techId },
      {
        onSuccess: onClose,
        onError: (err: any) =>
          Alert.alert("Couldn't assign", err?.message ?? "Please try again."),
      },
    );
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} height={440}>
      <View className="flex-row items-center justify-between px-[18px] pt-[8px]">
        <Txt className="font-bold text-[18px]" style={{ letterSpacing: -0.3 }}>
          Assign technician
        </Txt>
        <Pressable onPress={onClose} hitSlop={10}>
          <Icon name="x" size={20} weight="bold" color="#6B7280" />
        </Pressable>
      </View>

      {isLoading ? (
        <Loading label="Loading team…" />
      ) : (
        <ScrollView contentContainerStyle={{ paddingHorizontal: 18, paddingTop: 14, paddingBottom: 24, gap: 8 }}>
          {techs.map((t) => {
            const selected = current?.id ? t.id === current.id : t.name === current?.name;
            return (
              <TechRow
                key={t.id}
                name={t.name}
                initials={t.initials}
                color={t.color}
                selected={selected}
                onPress={() => (selected ? onClose() : assign(t.id!))}
              />
            );
          })}
          {techs.length === 0 ? (
            <Txt className="mt-[8px] text-center font-medium text-[13px] text-muted">
              No technicians on the team yet
            </Txt>
          ) : null}
          {current ? (
            <Pressable
              className="mt-[4px] flex-row items-center justify-center rounded-card border-[1.5px] border-dashed border-[#E2E2E8] py-[13px]"
              style={{ gap: 7 }}
              onPress={() => assign("")}
            >
              <Icon name="x" size={15} weight="bold" color="#6B7280" />
              <Txt className="font-bold text-[13px] text-muted">Unassign</Txt>
            </Pressable>
          ) : null}
        </ScrollView>
      )}
    </BottomSheet>
  );
}

function TechRow({
  name,
  initials,
  color,
  selected,
  onPress,
}: {
  name: string;
  initials: string;
  color: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      className={`flex-row items-center rounded-card bg-white p-[12px] ${selected ? "border-[1.5px] border-orange" : "border-[1.5px] border-[#F0F0F2]"}`}
      style={{ gap: 11 }}
      onPress={onPress}
    >
      <Avatar initials={initials} color={color} size={36} />
      <Txt className="flex-1 font-bold text-[14px]">{name}</Txt>
      {selected ? <Icon name="check-circle" size={20} weight="fill" color="#FF5A1F" /> : null}
    </Pressable>
  );
}
