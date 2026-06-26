import { View } from "react-native";
import { Txt } from "@/components/ui/Txt";
import { Avatar } from "@/components/ui/Avatar";
import { Icon } from "@/components/Icon";
import { cardShadow } from "@/lib/theme";

// Centered system pill (approval / completion markers).
export function SystemPill({
  text,
  icon = "shield-check",
  tone = "purple",
}: {
  text: string;
  icon?: "shield-check" | "check-circle";
  tone?: "purple" | "green";
}) {
  const bg = tone === "green" ? "#E7F8EE" : "#F2ECFE";
  const fg = tone === "green" ? "#16A34A" : "#6C2BD9";
  return (
    <View
      className="flex-row items-center self-center rounded-full px-[13px] py-[6px]"
      style={{ backgroundColor: bg, gap: 5 }}
    >
      <Icon name={icon} size={13} color={fg} weight="fill" />
      <Txt className="font-bold text-[10.5px]" style={{ color: fg }}>
        {text}
      </Txt>
    </View>
  );
}

// A left-aligned message row with avatar + bubble content.
export function Row({
  initials,
  color,
  children,
}: {
  initials: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <View className="flex-row items-end" style={{ gap: 8 }}>
      <Avatar initials={initials} color={color} size={28} />
      <View style={{ maxWidth: "80%" }}>{children}</View>
    </View>
  );
}

export function Bubble({
  children,
  className = "",
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: any;
}) {
  return (
    <View
      className={`rounded-[15px] rounded-tl-[5px] bg-white px-[12px] py-[9px] ${className}`}
      style={[{ shadowColor: "#281E14", shadowOpacity: 0.07, shadowRadius: 3, shadowOffset: { width: 0, height: 1 } }, style]}
    >
      {children}
    </View>
  );
}

export function BubbleTime({ children, className = "" }: { children: string; className?: string }) {
  return <Txt className={`mt-[4px] text-[9px] font-medium text-[#A1A1AA] ${className}`}>{children}</Txt>;
}

// Static voice-note waveform.
const HEIGHTS = [6, 12, 20, 24, 15, 9];
export function Waveform({
  bars = [2, 4, 3, 5, 1, 3, 4, 2, 6, 3, 5, 2],
  color = "#FF5A1F",
  height = 24,
  gap = 2,
}: {
  bars?: number[];
  color?: string;
  height?: number;
  gap?: number;
}) {
  return (
    <View className="flex-row items-center" style={{ height, gap }}>
      {bars.map((b, i) => (
        <View
          key={i}
          style={{ width: 3, borderRadius: 2, backgroundColor: color, height: HEIGHTS[(b - 1) % HEIGHTS.length] * (height / 24) }}
        />
      ))}
    </View>
  );
}
