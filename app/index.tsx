import { useState } from "react";
import { Pressable, View } from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Txt } from "@/components/ui/Txt";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/Icon";
import { useRole, ROLE_HOME } from "@/lib/role";
import { WORKSHOP, type Role } from "@/data/mock";

const ROLES: { key: Role; label: string }[] = [
  { key: "tech", label: "Technician" },
  { key: "manager", label: "Manager" },
  { key: "admin", label: "Admin" },
];

function Field({ icon, value }: { icon: "envelope-simple" | "lock-simple"; value: string }) {
  return (
    <View
      className="w-full flex-row items-center rounded-[14px] bg-white px-[16px] py-[16px]"
      style={{ gap: 11, shadowColor: "#281E14", shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } }}
    >
      <Icon name={icon} size={19} color="#9CA3AF" />
      <Txt className="font-medium text-[14px] text-faint">{value}</Txt>
    </View>
  );
}

export default function Login() {
  const { role, setRole } = useRole();
  const [sel, setSel] = useState<Role>(role);

  const signIn = () => {
    setRole(sel);
    router.replace(ROLE_HOME[sel] as any);
  };

  return (
    <View className="flex-1">
      <StatusBar style="dark" />
      <LinearGradient colors={["#FFEAE0", "#F7ECF4", "#F7F7F8"]} locations={[0, 0.34, 0.62]} style={{ flex: 1 }}>
        <SafeAreaView className="flex-1" edges={["top", "bottom"]}>
          <View className="flex-1 items-center justify-center px-[32px]" style={{ gap: 13 }}>
            <View
              className="h-[78px] w-[78px] items-center justify-center rounded-[23px] bg-orange"
              style={{ shadowColor: "#FF5A1F", shadowOpacity: 0.36, shadowRadius: 32, shadowOffset: { width: 0, height: 16 } }}
            >
              <Icon name="wrench" size={38} color="#fff" weight="fill" />
            </View>
            <Txt className="font-black text-[31px]" style={{ letterSpacing: -0.6 }}>
              Garage Flow
            </Txt>
            <Txt className="font-medium text-[14px] text-muted" style={{ marginTop: -6, marginBottom: 6 }}>
              Workshop management, simplified
            </Txt>

            <Field icon="envelope-simple" value="Phone or email" />
            <Field icon="lock-simple" value="••••••••" />

            {/* Role picker — choose which workspace to sign into */}
            <View className="mt-[2px] w-full">
              <Txt className="mb-[8px] font-bold text-[11px] text-faint" style={{ letterSpacing: 0.4 }}>
                SIGN IN AS
              </Txt>
              <View className="flex-row" style={{ gap: 8 }}>
                {ROLES.map((r) => {
                  const on = r.key === sel;
                  return (
                    <Pressable
                      key={r.key}
                      onPress={() => setSel(r.key)}
                      className={`flex-1 items-center rounded-[12px] border-[1.5px] py-[11px] ${
                        on ? "border-orange bg-orange-soft" : "border-[#EAEAEE] bg-white"
                      }`}
                    >
                      <Txt className={`font-bold text-[13px] ${on ? "text-orange" : "text-muted"}`}>{r.label}</Txt>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <Button label="Sign In" icon="arrow-right" iconWeight="bold" className="mt-[4px] w-full" onPress={signIn} />
            <Txt className="mt-[2px] font-bold text-[13px] text-orange">Forgot password?</Txt>
          </View>

          <View className="flex-row items-center justify-center pb-[12px]" style={{ gap: 6 }}>
            <Icon name="storefront" size={14} color="#9CA3AF" weight="fill" />
            <Txt className="font-bold text-[12px] text-faint">{WORKSHOP}</Txt>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}
