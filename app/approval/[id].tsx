import { useLocalSearchParams } from "expo-router";
import { ApprovalScreen } from "@/components/screens/ApprovalScreen";

export default function ApprovalDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <ApprovalScreen id={id} back />;
}
