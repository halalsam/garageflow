import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from "react-native";
import { router } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Txt } from "@/components/ui/Txt";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/Icon";
import { useNewJob } from "@/components/job/useNewJob";
import { VehicleSearchField } from "@/components/job/VehicleSearchField";
import { CustomerPicker } from "@/components/job/CustomerPicker";
import { LineItemRow } from "@/components/job/LineItemRow";
import { LineItemPickerSheet } from "@/components/job/LineItemPickerSheet";
import { JobField } from "@/components/job/JobField";
import { useCreateJob } from "@/lib/api/hooks/mutations";
import { uploadVehiclePhoto } from "@/lib/api/endpoints";
import { ApiRequestError } from "@/lib/api/client";
import { inr } from "@/lib/format";

// New Job Card — a real create-job form wired to POST /jobs. Composition only:
// the vehicle/customer/line-item pieces own their own interaction; this screen
// arranges them, derives totals, and submits via useCreateJob.
export default function NewJobCard() {
  const job = useNewJob();
  const create = useCreateJob();
  const insets = useSafeAreaInsets();
  const [pickerOpen, setPickerOpen] = useState(false);

  const submit = () => {
    if (!job.canSubmit || create.isPending) return;
    create.mutate(job.buildPayload(), {
      onSuccess: (created) => {
        // Attach the captured vehicle photo now that the vehicle exists. Fire and
        // forget — a failed upload shouldn't block navigating to the new job.
        if (job.vehiclePhotoUri && created.vehicleId) {
          const uri = job.vehiclePhotoUri;
          const ext = uri.split(".").pop()?.toLowerCase() ?? "jpg";
          const form = new FormData();
          form.append("image", { uri, name: `vehicle.${ext}`, type: `image/${ext === "jpg" ? "jpeg" : ext}` } as any);
          void uploadVehiclePhoto(created.vehicleId, form).catch(() => {});
        }
        router.replace(`/job/${created.id}`);
      },
      onError: (err) => {
        const msg =
          err instanceof ApiRequestError && err.errors
            ? Object.values(err.errors).flat().join("\n")
            : "Please check the details and try again.";
        Alert.alert("Couldn't create job", msg);
      },
    });
  };

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-bg">
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View className="flex-row items-center justify-between px-[18px] pb-[10px] pt-[6px]">
        <Txt className="font-black text-[21px]" style={{ letterSpacing: -0.5 }}>
          New Job Card
        </Txt>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Icon name="x" size={21} weight="bold" color="#6B7280" />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ gap: 16 }}>
          <VehicleSearchField job={job} />
          <CustomerPicker job={job} />

          <JobField
            label="ODOMETER (KM)"
            placeholder="e.g. 42000"
            keyboardType="number-pad"
            value={job.odometer}
            onChangeText={(v) => job.setOdometer(v.replace(/[^0-9]/g, ""))}
          />

          <JobField
            label="COMPLAINT"
            placeholder="e.g. Brakes squealing, soft pedal…"
            multiline
            value={job.complaint}
            onChangeText={job.setComplaint}
          />

          {/* line items */}
          <View>
            <View className="flex-row items-center justify-between">
              <Txt className="font-bold text-[15px]">Line items</Txt>
              <Pressable className="flex-row items-center" style={{ gap: 4 }} onPress={() => setPickerOpen(true)}>
                <Icon name="plus" size={14} weight="bold" color="#FF5A1F" />
                <Txt className="font-bold text-[13px] text-orange">Add</Txt>
              </Pressable>
            </View>

            {job.lines.length === 0 ? (
              <View className="mt-[10px] items-center rounded-card border-[1.5px] border-dashed border-[#E2E2E8] py-[22px]">
                <Icon name="receipt" size={24} color="#C3C3CC" />
                <Txt className="mt-[7px] font-medium text-[12px] text-faint">
                  No line items yet — add parts or labour
                </Txt>
              </View>
            ) : (
              <Card className="mt-[10px] px-[12px] py-[2px]">
                {job.lines.map((l, i) => (
                  <LineItemRow
                    key={l.id}
                    line={l}
                    first={i === 0}
                    onChangeAmount={(amount) => job.updateLine(l.id, { amount })}
                    onRemove={() => job.removeLine(l.id)}
                  />
                ))}
              </Card>
            )}
          </View>
        </View>
      </ScrollView>

      {/* totals (only once there's an estimate) */}
      {job.lines.length > 0 ? (
        <View className="border-t border-[#F0F0F2] bg-white px-[18px] py-[12px]">
          <TotalRow label="Subtotal" value={inr(job.subtotal)} />
          <TotalRow label={`GST ${job.gstRate}%`} value={inr(job.gst)} />
          <TotalRow label="Total" value={inr(job.total)} big />
        </View>
      ) : null}

      {/* submit */}
      <View
        className="border-t border-[#F0F0F2] bg-white px-[16px] pt-[14px]"
        style={{ paddingBottom: insets.bottom > 0 ? insets.bottom + 6 : 16, shadowColor: "#281E14", shadowOpacity: 0.06, shadowRadius: 16, shadowOffset: { width: 0, height: -4 }, elevation: 8 }}
      >
        <Button
          label={create.isPending ? "Creating…" : job.lines.length > 0 ? "Create & send for review" : "Create job card"}
          icon="paper-plane-tilt"
          disabled={!job.canSubmit || create.isPending}
          className={!job.canSubmit ? "opacity-50" : ""}
          onPress={submit}
        />
      </View>
      </KeyboardAvoidingView>

      <LineItemPickerSheet job={job} visible={pickerOpen} onClose={() => setPickerOpen(false)} />
    </SafeAreaView>
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
