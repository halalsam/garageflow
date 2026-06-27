import { ActivityIndicator, View } from "react-native";
import { Txt } from "@/components/ui/Txt";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/Icon";
import { C } from "@/lib/theme";

// Centered fillers for the three async states a screen can be in while a query
// resolves. Screens render these in place of their content; the surrounding
// chrome (TopBar etc.) stays put.

export function Loading({ label }: { label?: string }) {
  return (
    <View className="flex-1 items-center justify-center" style={{ gap: 10, paddingVertical: 48 }}>
      <ActivityIndicator color={C.orange} />
      {label ? <Txt className="font-medium text-[13px] text-muted">{label}</Txt> : null}
    </View>
  );
}

export function ErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <View className="flex-1 items-center justify-center px-[32px]" style={{ gap: 12, paddingVertical: 40 }}>
      <Icon name="x-circle" size={34} color="#DC2626" weight="fill" />
      <Txt className="text-center font-bold text-[14px]">Couldn&apos;t load this</Txt>
      <Txt className="text-center font-medium text-[13px] text-muted">
        Check your connection to the workshop server and try again.
      </Txt>
      {onRetry ? <Button label="Retry" icon="arrows-clockwise" iconWeight="bold" small onPress={onRetry} /> : null}
    </View>
  );
}

export function EmptyState({ icon = "list-checks", text }: { icon?: React.ComponentProps<typeof Icon>["name"]; text: string }) {
  return (
    <View className="flex-1 items-center justify-center" style={{ gap: 10, paddingVertical: 48 }}>
      <Icon name={icon} size={30} color="#9CA3AF" weight="regular" />
      <Txt className="font-medium text-[13px] text-muted">{text}</Txt>
    </View>
  );
}
