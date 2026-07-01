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

// A message row. Incoming messages sit left with an avatar; `own` messages
// (authored by the current user) sit right with no avatar.
//
// The wrapper uses `alignItems: flex-start/flex-end` so each bubble hugs its
// content instead of stretching to the full 80% column — that stretch was what
// made short messages look elongated.
export function Row({
  initials,
  color,
  name,
  own = false,
  children,
}: {
  initials: string;
  color: string;
  name?: string;
  own?: boolean;
  children: React.ReactNode;
}) {
  if (own) {
    return (
      <View className="flex-row items-end justify-end">
        <View style={{ maxWidth: "80%", alignItems: "flex-end" }}>{children}</View>
      </View>
    );
  }
  return (
    <View className="flex-row items-end" style={{ gap: 8 }}>
      <Avatar initials={initials} color={color} size={28} />
      <View style={{ maxWidth: "80%", alignItems: "flex-start" }}>
        {name ? (
          <Txt className="mb-[2px] ml-[2px] font-bold text-[10.5px] text-muted">{name}</Txt>
        ) : null}
        {children}
      </View>
    </View>
  );
}

export function Bubble({
  children,
  className = "",
  own = false,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  own?: boolean;
  style?: any;
}) {
  // Own bubbles flip the small corner to the top-right and tint orange.
  const tone = own ? "bg-orange rounded-tr-[5px]" : "bg-white rounded-tl-[5px]";
  return (
    <View
      className={`rounded-[15px] px-[12px] py-[9px] ${tone} ${className}`}
      style={[{ shadowColor: "#281E14", shadowOpacity: 0.07, shadowRadius: 3, shadowOffset: { width: 0, height: 1 }, elevation: 1 }, style]}
    >
      {children}
    </View>
  );
}

export function BubbleTime({
  children,
  own = false,
  className = "",
}: {
  children: string;
  own?: boolean;
  className?: string;
}) {
  const color = own ? "text-white/70" : "text-[#A1A1AA]";
  return <Txt className={`mt-[4px] self-end text-[9px] font-medium ${color} ${className}`}>{children}</Txt>;
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
