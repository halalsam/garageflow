import { Text, type TextProps } from "react-native";

// Default to Satoshi via NativeWind font-* utilities. Pass `className` to
// override weight/size/color, e.g. <Txt className="font-black text-2xl">.
export function Txt({ className = "", ...props }: TextProps & { className?: string }) {
  return <Text className={`font-sans text-ink ${className}`} {...props} />;
}
