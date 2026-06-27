import { useRef } from "react";
import { ScrollView } from "react-native";
import { ChatMessage } from "@/components/chat/ChatMessage";
import type { Person, TimelineItem } from "@/types/api";
// Scrollable message feed that pins to the latest message as it grows.
export function ChatFeed({ messages, me }: { messages: TimelineItem[]; me?: Person }) {
  const ref = useRef<ScrollView>(null);
  return (
    <ScrollView
      ref={ref}
      keyboardDismissMode="interactive"
      contentContainerStyle={{ padding: 14, paddingBottom: 24, gap: 11 }}
      onContentSizeChange={() => ref.current?.scrollToEnd({ animated: true })}
    >
      {messages.map((it, i) => (
        <ChatMessage key={i} it={it} me={me} />
      ))}
    </ScrollView>
  );
}
