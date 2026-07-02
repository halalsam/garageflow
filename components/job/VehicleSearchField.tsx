import { useState } from "react";
import { ActivityIndicator, Image, Pressable, TextInput, View } from "react-native";
import { Txt } from "@/components/ui/Txt";
import { Card } from "@/components/ui/Card";
import { Plate } from "@/components/ui/Plate";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Icon } from "@/components/Icon";
import { JobField } from "./JobField";
import { pickPhotoSource } from "@/lib/media/pickPhoto";
import { C, cardShadow } from "@/lib/theme";
import { useVehicleSearch } from "@/lib/api/hooks/queries";
import type { VehicleType } from "@/types/api";
import type { NewJob } from "./useNewJob";

const TYPES: VehicleType[] = ["HATCHBACK", "SEDAN", "SUV", "MUV", "OTHER"];

// Vehicle picker for the New Job card. Search existing vehicles by plate (the
// owner comes along), or expand "Add new vehicle" to enter details that create
// one on submit. Owns only its local search/expand UI; the chosen vehicle lives
// in the parent `useNewJob` state.
export function VehicleSearchField({ job }: { job: NewJob }) {
  const [term, setTerm] = useState("");
  const [manual, setManual] = useState(false);
  const { data: hits, isFetching } = useVehicleSearch(term);
  const showResults = term.trim().length >= 2 && !job.vehicle;

  // Snap a photo of the vehicle (camera or library). Held locally; uploaded once
  // the job/vehicle exists.
  const pickVehiclePhoto = () => pickPhotoSource(job.setVehiclePhotoUri, "Vehicle photo");

  if (job.vehicle) {
    return (
      <View>
        <SectionLabel>VEHICLE</SectionLabel>
        <Card className="mt-[8px] flex-row items-center justify-between p-[13px]">
          <View className="flex-1" style={{ gap: 6 }}>
            <Plate number={job.vehicle.plate} scale={0.9} />
            <Txt className="font-bold text-[13px]">
              {job.vehicle.make} {job.vehicle.model} · {job.vehicle.year}
            </Txt>
          </View>
          <Pressable
            hitSlop={10}
            onPress={() => {
              job.clearVehicle();
              setTerm("");
            }}
          >
            <Icon name="x-circle" size={22} weight="fill" color="#C3C3CC" />
          </Pressable>
        </Card>
      </View>
    );
  }

  return (
    <View>
      <SectionLabel>VEHICLE</SectionLabel>

      {/* plate search */}
      <View
        className="mt-[8px] flex-row items-center rounded-full bg-white px-[16px] py-[12px]"
        style={[cardShadow, { gap: 10 }]}
      >
        <Icon name="search" size={18} color="#9CA3AF" />
        <TextInput
          className="flex-1 font-medium text-[14px] text-ink"
          placeholder="Search vehicle / plate"
          placeholderTextColor="#9CA3AF"
          autoCapitalize="characters"
          autoCorrect={false}
          value={term}
          onChangeText={setTerm}
        />
        {isFetching ? <ActivityIndicator color={C.orange} /> : null}
      </View>

      {/* live results */}
      {showResults ? (
        <View className="mt-[8px]" style={{ gap: 8 }}>
          {(hits ?? []).map((h) => (
            <Card
              key={h.id}
              className="flex-row items-center justify-between p-[12px]"
              onPress={() => {
                job.selectVehicle(h);
                setTerm("");
                setManual(false);
              }}
            >
              <View className="flex-1" style={{ gap: 5 }}>
                <Plate number={h.plate} scale={0.82} />
                <Txt className="font-bold text-[12px] text-muted">
                  {h.make} {h.model} · {h.customer.name}
                </Txt>
              </View>
              <Icon name="caret-right" size={16} color="#C3C3CC" weight="bold" />
            </Card>
          ))}
          {!isFetching && (hits ?? []).length === 0 ? (
            <Txt className="px-[4px] font-medium text-[12px] text-faint">No matching vehicle — add a new one below.</Txt>
          ) : null}
        </View>
      ) : null}

      {/* manual / new vehicle */}
      <Pressable
        className="mt-[10px] flex-row items-center"
        style={{ gap: 6 }}
        onPress={() => setManual((m) => !m)}
      >
        <Icon name={manual ? "caret-up-down" : "plus"} size={14} weight="bold" color="#FF5A1F" />
        <Txt className="font-bold text-[13px] text-orange">{manual ? "New vehicle details" : "Add new vehicle"}</Txt>
      </Pressable>

      {manual ? (
        <View className="mt-[10px]" style={{ gap: 10 }}>
          <JobField
            label="PLATE"
            placeholder="DL 3C AT 7788"
            autoCapitalize="characters"
            value={job.vehicleDraft.plate}
            onChangeText={(v) => job.editVehicleDraft({ plate: v })}
          />
          <View className="flex-row" style={{ gap: 10 }}>
            <JobField
              className="flex-1"
              label="MAKE"
              placeholder="Tata"
              value={job.vehicleDraft.make}
              onChangeText={(v) => job.editVehicleDraft({ make: v })}
            />
            <JobField
              className="flex-1"
              label="MODEL"
              placeholder="Nexon"
              value={job.vehicleDraft.model}
              onChangeText={(v) => job.editVehicleDraft({ model: v })}
            />
          </View>
          <JobField
            label="YEAR"
            placeholder="2020"
            keyboardType="number-pad"
            maxLength={4}
            value={job.vehicleDraft.year}
            onChangeText={(v) => job.editVehicleDraft({ year: v.replace(/[^0-9]/g, "") })}
          />
          <View>
            <SectionLabel>TYPE</SectionLabel>
            <View className="mt-[8px] flex-row flex-wrap" style={{ gap: 8 }}>
              {TYPES.map((t) => {
                const on = job.vehicleDraft.type === t;
                return (
                  <Pressable
                    key={t}
                    onPress={() => job.editVehicleDraft({ type: t })}
                    className={`rounded-full border-[1.5px] px-[13px] py-[7px] ${
                      on ? "border-orange bg-orange-soft" : "border-[#EAEAEE] bg-white"
                    }`}
                  >
                    <Txt className={`font-bold text-[12px] ${on ? "text-orange" : "text-muted"}`}>{t}</Txt>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* optional vehicle photo */}
          <View>
            <SectionLabel>PHOTO (OPTIONAL)</SectionLabel>
            <Pressable className="mt-[8px]" onPress={pickVehiclePhoto}>
              {job.vehiclePhotoUri ? (
                <View className="overflow-hidden rounded-card" style={{ height: 150 }}>
                  <Image source={{ uri: job.vehiclePhotoUri }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
                  <View className="absolute bottom-[8px] right-[8px] flex-row items-center rounded-full bg-black/55 px-[10px] py-[5px]" style={{ gap: 5 }}>
                    <Icon name="camera" size={13} color="#fff" weight="fill" />
                    <Txt className="font-bold text-[11px] text-white">Change</Txt>
                  </View>
                </View>
              ) : (
                <View
                  className="items-center justify-center rounded-card bg-white"
                  style={{ height: 96, borderWidth: 1.5, borderColor: "#E5E7EB", borderStyle: "dashed" }}
                >
                  <Icon name="camera" size={22} color="#9CA3AF" weight="regular" />
                  <Txt className="mt-[6px] font-medium text-[12px] text-muted">Add a photo of the vehicle</Txt>
                </View>
              )}
            </Pressable>
          </View>
        </View>
      ) : null}
    </View>
  );
}
