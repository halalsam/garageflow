import { useEffect, useRef } from "react";
import { FlatList, View } from "react-native";
import { router } from "expo-router";
import { Screen } from "@/components/ui/Screen";
import { TopBar } from "@/components/ui/TopBar";
import { Txt } from "@/components/ui/Txt";
import { Icon } from "@/components/Icon";
import { Loading, ErrorState } from "@/components/ui/QueryState";
import { NotificationRow } from "@/components/notifications/NotificationRow";
import { useNotifications } from "@/lib/api/hooks/queries";
import { useMarkNotificationsRead } from "@/lib/api/hooks/mutations";
import type { AppNotification } from "@/types/api";

// The notifications inbox — persisted copies of every push sent to this user,
// so nothing is lost when a push is missed. Opening the screen marks all read.
export function NotificationsScreen() {
  const { data, isLoading, isError, refetch } = useNotifications();
  const markRead = useMarkNotificationsRead();

  // Mark read once per visit, after the inbox has loaded (so the user sees the
  // unread state first render, then the badge clears for next time).
  const marked = useRef(false);
  useEffect(() => {
    if (!data || marked.current || data.unread === 0) return;
    marked.current = true;
    markRead.mutate();
  }, [data]);

  const open = (n: AppNotification) => {
    if (n.data?.jobCode) router.push(`/job/${n.data.jobCode}`);
  };

  return (
    <Screen>
      <TopBar title="Notifications" back />
      {isLoading ? (
        <Loading label="Loading notifications…" />
      ) : isError || !data ? (
        <ErrorState onRetry={() => refetch()} />
      ) : data.items.length === 0 ? (
        <View className="flex-1 items-center justify-center px-[32px]" style={{ gap: 10 }}>
          <Icon name="bell" size={34} color="#C3C3CC" />
          <Txt className="text-center font-medium text-[13px] text-faint">
            Nothing yet — job updates, approvals and messages will show up here
          </Txt>
        </View>
      ) : (
        <FlatList
          data={data.items}
          keyExtractor={(n) => n.id}
          contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 24, gap: 8 }}
          renderItem={({ item }) => <NotificationRow notification={item} onPress={() => open(item)} />}
        />
      )}
    </Screen>
  );
}
