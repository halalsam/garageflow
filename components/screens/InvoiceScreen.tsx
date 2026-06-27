import { ScrollView } from "react-native";
import { Screen } from "@/components/ui/Screen";
import { TopBar, HeaderIcon } from "@/components/ui/TopBar";
import { InvoiceReceipt } from "@/components/finance/InvoiceReceipt";
import { PaymentPanel } from "@/components/finance/PaymentPanel";
import { getInvoice } from "@/data/mock";

export function InvoiceScreen({ id }: { id?: string }) {
  const invoice = getInvoice(id);
  return (
    <Screen>
      <TopBar title="Invoice" back right={<HeaderIcon name="export" />} />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 28 }}>
        <InvoiceReceipt invoice={invoice} />
        <PaymentPanel invoice={invoice} />
      </ScrollView>
    </Screen>
  );
}
