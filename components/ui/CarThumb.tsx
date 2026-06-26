import { View } from "react-native";
import { Icon } from "@/components/Icon";

// Striped placeholder "photo" of a vehicle. Children render as absolute
// overlays (plate, status badge, tag).
export function CarThumb({
  width,
  height,
  radius = 0,
  iconSize = 50,
  children,
  className = "",
}: {
  width?: number | string;
  height: number;
  radius?: number;
  iconSize?: number;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <View
      className={`items-center justify-center overflow-hidden bg-[#E6E6EB] ${className}`}
      style={{ width: width as any, height, borderRadius: radius }}
    >
      <Icon name="car-profile" size={iconSize} color="#C3C3CC" weight="fill" />
      {children}
    </View>
  );
}
