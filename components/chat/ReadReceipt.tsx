import { View } from "react-native";
import { Avatar } from "@/components/ui/Avatar";
import type { Person } from "@/types/api";

// Right-aligned row of tiny avatars shown under an own message to indicate
// which participants have read up to that point ("Seen by").
export function ReadReceipt({ people }: { people: Person[] }) {
  if (!people.length) return null;
  return (
    <View className="mt-[3px] flex-row justify-end" style={{ gap: 2 }}>
      {people.slice(0, 6).map((p, i) => (
        <Avatar key={p.id ?? p.initials + i} initials={p.initials} color={p.color} size={16} />
      ))}
    </View>
  );
}
