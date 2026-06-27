import { TextInput, View, type TextInputProps } from "react-native";
import { SectionLabel } from "@/components/ui/SectionLabel";

// A labelled text input matching the app's sheet/form fields. Used across the
// New Job card for the manual vehicle details, complaint, odometer, etc.
export function JobField({
  label,
  className = "",
  ...input
}: { label?: string; className?: string } & TextInputProps) {
  return (
    <View className={className}>
      {label ? <SectionLabel>{label}</SectionLabel> : null}
      <TextInput
        className={`rounded-[14px] bg-[#F4F4F6] px-[14px] py-[13px] font-medium text-[14px] text-ink ${label ? "mt-[8px]" : ""}`}
        placeholderTextColor="#9CA3AF"
        {...input}
      />
    </View>
  );
}
