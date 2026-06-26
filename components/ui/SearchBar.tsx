import { View, type ViewProps } from "react-native";
import { Txt } from "./Txt";
import { Icon } from "@/components/Icon";
import { cardShadow } from "@/lib/theme";

// Display-only search field (matches the comp — tap targets, no live input).
export function SearchBar({
  placeholder,
  className = "",
  style,
  flat,
  ...rest
}: { placeholder: string; flat?: boolean; className?: string } & ViewProps) {
  return (
    <View
      className={`flex-row items-center rounded-full px-[18px] py-[13px] ${
        flat ? "bg-line" : "bg-white"
      } ${className}`}
      style={[flat ? undefined : cardShadow, style]}
      {...rest}
    >
      <Icon name="search" size={19} color="#9CA3AF" />
      <Txt className="font-medium text-[14px] text-faint ml-[10px]">{placeholder}</Txt>
    </View>
  );
}
