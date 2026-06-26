import { View } from "react-native";
import { Txt } from "./Txt";

// Indian number plate: blue "IND" strip + mono registration.
export function Plate({ number, scale = 1 }: { number: string; scale?: number }) {
  return (
    <View
      className="flex-row self-start overflow-hidden rounded-[5px] border-[1.5px] border-[#111] bg-white"
      style={{ alignItems: "stretch" }}
    >
      <View className="justify-center bg-[#1f4fd8] px-[4px]">
        <Txt
          className="font-bold text-white"
          style={{ fontSize: 6.5 * scale, letterSpacing: 0.5 }}
        >
          IND
        </Txt>
      </View>
      <View className="justify-center px-[7px] py-[5px]">
        <Txt
          className="font-bold text-[#111]"
          style={{
            fontSize: 11 * scale,
            letterSpacing: 1,
            fontFamily: "monospace",
          }}
        >
          {number}
        </Txt>
      </View>
    </View>
  );
}
