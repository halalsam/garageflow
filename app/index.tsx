import { useState } from "react";
import { TextInput, View } from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Txt } from "@/components/ui/Txt";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/Icon";
import { useAuth, ROLE_HOME } from "@/lib/auth";
import { ApiRequestError } from "@/lib/api/client";
import { WORKSHOP } from "@/lib/format";
function Field({
  icon,
  ...props
}: { icon: "envelope-simple" | "lock-simple" } & React.ComponentProps<typeof TextInput>) {
  return (
    <View
      className="w-full flex-row items-center rounded-[14px] bg-white px-[16px] py-[16px]"
      style={{ gap: 11, shadowColor: "#281E14", shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } }}
    >
      <Icon name={icon} size={19} color="#9CA3AF" />
      <TextInput
        className="flex-1 font-medium text-[14px] text-ink"
        placeholderTextColor="#9CA3AF"
        {...props}
      />
    </View>
  );
}

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const signIn = async () => {
    if (busy) return;
    setError(null);
    setBusy(true);
    try {
      const user = await login(email.trim(), password);
      router.replace(ROLE_HOME[user.role] as any);
    } catch (e) {
      const msg =
        e instanceof ApiRequestError && e.statusCode === 401
          ? "Incorrect email or password"
          : "Couldn't sign in. Check your connection and try again.";
      setError(msg);
    } finally {
      setBusy(false);
    }
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

            <Field
              icon="envelope-simple"
              placeholder="Phone or email"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              textContentType="username"
              value={email}
              onChangeText={setEmail}
              returnKeyType="next"
            />
            <Field
              icon="lock-simple"
              placeholder="Password"
              secureTextEntry
              autoCapitalize="none"
              textContentType="password"
              value={password}
              onChangeText={setPassword}
              returnKeyType="go"
              onSubmitEditing={signIn}
            />

            {error ? (
              <View className="w-full flex-row items-center" style={{ gap: 6 }}>
                <Icon name="x-circle" size={15} color="#DC2626" weight="fill" />
                <Txt className="font-bold text-[12px]" style={{ color: "#DC2626" }}>
                  {error}
                </Txt>
              </View>
            ) : null}

            <Button
              label={busy ? "Signing in…" : "Sign In"}
              icon={busy ? undefined : "arrow-right"}
              iconWeight="bold"
              className="mt-[4px] w-full"
              onPress={signIn}
              disabled={busy}
            />
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
