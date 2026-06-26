import { Pressable, View, type PressableProps } from "react-native";
import { Txt } from "./Txt";
import { Icon, type IconName } from "@/components/Icon";

type Variant = "pri" | "pur" | "wa" | "green" | "ghost";

const BG: Record<Variant, string> = {
  pri: "bg-orange",
  pur: "bg-purple",
  wa: "bg-wa",
  green: "bg-green",
  ghost: "bg-white border-[1.5px] border-[#E7E7EA]",
};

const FG: Record<Variant, string> = {
  pri: "text-white",
  pur: "text-white",
  wa: "text-white",
  green: "text-white",
  ghost: "text-ink",
};

const ICON_COLOR: Record<Variant, string> = {
  pri: "#fff",
  pur: "#fff",
  wa: "#fff",
  green: "#fff",
  ghost: "#1A1A1A",
};

type Props = {
  label: string;
  variant?: Variant;
  icon?: IconName;
  iconWeight?: "regular" | "bold" | "fill";
  small?: boolean;
  className?: string;
  textClassName?: string;
} & Omit<PressableProps, "children">;

export function Button({
  label,
  variant = "pri",
  icon,
  iconWeight = "fill",
  small,
  className = "",
  textClassName = "",
  ...rest
}: Props) {
  return (
    <Pressable
      className={`flex-row items-center justify-center rounded-btn ${
        small ? "px-[14px] py-[11px]" : "p-[15px]"
      } ${BG[variant]} ${className} active:opacity-80`}
      {...rest}
    >
      <View className="flex-row items-center justify-center" style={{ gap: 8 }}>
        {icon ? (
          <Icon name={icon} size={small ? 16 : 18} color={ICON_COLOR[variant]} weight={iconWeight} />
        ) : null}
        <Txt
          className={`font-bold ${small ? "text-[13px]" : "text-[15px]"} ${FG[variant]} ${textClassName}`}
        >
          {label}
        </Txt>
      </View>
    </Pressable>
  );
}
