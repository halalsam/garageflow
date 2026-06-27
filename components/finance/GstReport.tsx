import { View } from "react-native";
import { Card } from "@/components/ui/Card";
import { Txt } from "@/components/ui/Txt";
import { Icon } from "@/components/Icon";
import { Loading, ErrorState } from "@/components/ui/QueryState";
import { useGstReport } from "@/lib/api/hooks/queries";
import { inr, MONTH_LABEL } from "@/lib/format";
function Row({ first, label, hint, value, strong }: { first?: boolean; label: string; hint?: string; value: string; strong?: boolean }) {
  return (
    <View
      className="flex-row items-center justify-between border-t border-line py-[11px]"
      style={first ? { borderTopWidth: 0 } : undefined}
    >
      <Txt className={strong ? "font-black text-[14px]" : "font-medium text-[13px]"}>
        {label} {hint ? <Txt className="font-medium text-[11px] text-muted">{hint}</Txt> : null}
      </Txt>
      <Txt className={strong ? "font-black text-[15px]" : "font-bold text-[13px]"} style={strong ? { color: "#6C2BD9" } : undefined}>
        {value}
      </Txt>
    </View>
  );
}

// GST output-tax summary for the period — what was collected on sales and is
// payable in GSTR-3B. 18% intra-state splits into CGST 9% + SGST 9%.
export function GstReport() {
  const { data: g, isLoading, isError, refetch } = useGstReport();
  if (isLoading) return <Loading label="Loading GST report…" />;
  if (isError || !g) return <ErrorState onRetry={() => refetch()} />;
  return (
    <Card className="p-[15px]">
      <View className="flex-row items-center" style={{ gap: 8 }}>
        <View className="h-[34px] w-[34px] items-center justify-center rounded-[9px] bg-[#F2ECFE]">
          <Icon name="percent" size={17} color="#6C2BD9" weight="bold" />
        </View>
        <View>
          <Txt className="font-black text-[14px]">Output tax — {MONTH_LABEL}</Txt>
          <Txt className="font-medium text-[11px] text-muted">{g.count} taxable invoices</Txt>
        </View>
      </View>

      <View className="mt-[12px]">
        <Row first label="Taxable value" value={inr(g.taxable)} />
        <Row label="CGST" hint="9%" value={inr(g.cgst)} />
        <Row label="SGST" hint="9%" value={inr(g.sgst)} />
        <Row label="Total GST payable" value={inr(g.gst)} strong />
      </View>
    </Card>
  );
}
