import { useLocalSearchParams } from "expo-router";
import { InvoiceScreen } from "@/components/screens/InvoiceScreen";

export default function Invoice() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <InvoiceScreen id={id} />;
}
