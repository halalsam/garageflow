import { useLocalSearchParams } from "expo-router";
import { LedgerStatementScreen } from "@/components/screens/LedgerStatementScreen";
import { INVOICES } from "@/data/mock";

export default function LedgerStatement() {
  const { party } = useLocalSearchParams<{ party: string }>();
  // Fall back to the first customer if the param is missing/unknown.
  const name = INVOICES.some((i) => i.customer === party) ? party : INVOICES[0].customer;
  return <LedgerStatementScreen party={name} />;
}
