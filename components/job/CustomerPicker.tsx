import { useState } from "react";
import { ActivityIndicator, Pressable, TextInput, View } from "react-native";
import { Txt } from "@/components/ui/Txt";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Icon } from "@/components/Icon";
import { C, cardShadow } from "@/lib/theme";
import { useCustomerSearch } from "@/lib/api/hooks/queries";
import type { NewJob } from "./useNewJob";

// Customer picker for the New Job card. Search existing customers (name/phone)
// and tap to select, or type a name to create one on submit. When a vehicle was
// picked its owner is adopted automatically, shown here as a locked selection.
export function CustomerPicker({ job }: { job: NewJob }) {
  const [term, setTerm] = useState("");
  const { data, isFetching } = useCustomerSearch(term);
  const results = data?.items ?? [];
  const showResults = term.trim().length >= 2;

  // Owner inherited from a picked existing vehicle — not separately editable.
  const lockedToVehicle = !!job.vehicle && !job.customerId;

  if (job.customer && (job.customerId || lockedToVehicle)) {
    return (
      <View>
        <SectionLabel>CUSTOMER</SectionLabel>
        <Card className="mt-[8px] flex-row items-center justify-between p-[12px]">
          <View className="flex-row items-center" style={{ gap: 10 }}>
            <Avatar initials={job.customer.initials || "?"} color={job.customer.color} size={34} />
            <View>
              <Txt className="font-bold text-[14px]">{job.customer.name}</Txt>
              {lockedToVehicle ? (
                <Txt className="mt-[2px] font-medium text-[11px] text-muted">Owner of this vehicle</Txt>
              ) : null}
            </View>
          </View>
          {lockedToVehicle ? null : (
            <Pressable hitSlop={10} onPress={() => job.clearCustomer()}>
              <Icon name="x-circle" size={22} weight="fill" color="#C3C3CC" />
            </Pressable>
          )}
        </Card>
      </View>
    );
  }

  return (
    <View>
      <SectionLabel>CUSTOMER</SectionLabel>

      <View
        className="mt-[8px] flex-row items-center rounded-full bg-white px-[16px] py-[12px]"
        style={[cardShadow, { gap: 10 }]}
      >
        <Icon name="user" size={18} color="#9CA3AF" />
        <TextInput
          className="flex-1 font-medium text-[14px] text-ink"
          placeholder="Customer name or phone"
          placeholderTextColor="#9CA3AF"
          value={term}
          onChangeText={(v) => {
            setTerm(v);
            job.typeCustomerName(v);
          }}
        />
        {isFetching ? <ActivityIndicator color={C.orange} /> : null}
      </View>

      {showResults ? (
        <View className="mt-[8px]" style={{ gap: 8 }}>
          {results.map((c) => (
            <Card
              key={c.id}
              className="flex-row items-center justify-between p-[11px]"
              onPress={() => {
                job.selectCustomer(c);
                setTerm("");
              }}
            >
              <View className="flex-row items-center" style={{ gap: 10 }}>
                <Avatar initials={c.initials} color={c.color} size={32} />
                <View>
                  <Txt className="font-bold text-[13px]">{c.name}</Txt>
                  {c.phone ? <Txt className="mt-[2px] font-medium text-[11px] text-muted">{c.phone}</Txt> : null}
                </View>
              </View>
              <Icon name="caret-right" size={16} color="#C3C3CC" weight="bold" />
            </Card>
          ))}
          {!isFetching && results.length === 0 ? (
            <Txt className="px-[4px] font-medium text-[12px] text-faint">
              No match — “{term.trim()}” will be added as a new customer.
            </Txt>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}
