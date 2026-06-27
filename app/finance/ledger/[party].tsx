import { useLocalSearchParams } from "expo-router";
import { LedgerStatementScreen } from "@/components/screens/LedgerStatementScreen";

export default function LedgerStatement() {
  // The route param is the customer id (from the ledgers list). The folder is
  // still named [party] for backwards-compatible deep links.
  const { party } = useLocalSearchParams<{ party: string }>();
  return <LedgerStatementScreen customerId={party} />;
}
