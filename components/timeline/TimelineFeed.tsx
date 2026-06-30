import { useMemo } from "react";
import { View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { EventRow } from "./EventRow";
import { useEventReceipts } from "./useEventReceipts";
import type { JobEvent, JobRead, Person } from "@/types/api";

// The realtime timeline. FlashList v2 has no `inverted` prop — the chat pattern
// is a chronological list (oldest→newest) that renders from the bottom and keeps
// its visual position when older pages are prepended at the top
// (maintainVisibleContentPosition, on by default). `events` arrives newest-first
// from the hook, so we reverse it for display. Reaching the top
// (onStartReached) loads the next older page.
export function TimelineFeed({
  events,
  me,
  reads,
  onLoadOlder,
  hasMore,
}: {
  events: JobEvent[];
  me?: Person;
  reads?: JobRead[];
  onLoadOlder?: () => void;
  hasMore?: boolean;
}) {
  const receipts = useEventReceipts(events, me, reads);
  const data = useMemo(() => [...events].reverse(), [events]);

  // FlashList needs a flex-sized parent to fill the space between the header and
  // the composer.
  return (
    <View className="flex-1">
      <FlashList
        data={data}
        keyExtractor={(it) => it.clientId ?? it.id}
        renderItem={({ item }) => <EventRow event={item} me={me} seenBy={receipts[item.id]} />}
        ItemSeparatorComponent={Separator}
        contentContainerStyle={{ padding: 14 }}
        keyboardDismissMode="interactive"
        maintainVisibleContentPosition={{
          startRenderingFromBottom: true,
          autoscrollToBottomThreshold: 0.2,
        }}
        onStartReached={hasMore ? onLoadOlder : undefined}
        onStartReachedThreshold={0.4}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const Separator = () => <View style={{ height: 11 }} />;
