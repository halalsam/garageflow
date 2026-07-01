import { Image, View } from "react-native";
import { Icon } from "@/components/Icon";

// "Photo" of a vehicle: the real image when `uri` is set, otherwise a striped
// placeholder. Children render as absolute overlays (plate, status badge, tag).
export function CarThumb({
  width,
  height,
  radius = 0,
  iconSize = 50,
  uri,
  children,
  className = "",
}: {
  width?: number | string;
  height: number;
  radius?: number;
  iconSize?: number;
  uri?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <View
      className={`items-center justify-center overflow-hidden bg-[#E6E6EB] ${className}`}
      style={{ width: width as any, height, borderRadius: radius }}
    >
      {uri ? (
        <Image source={{ uri }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
      ) : (
        <Icon name="car-profile" size={iconSize} color="#C3C3CC" weight="fill" />
      )}
      {children}
    </View>
  );
}
