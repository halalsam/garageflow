import { Txt } from "./Txt";

// Small uppercase section heading, e.g. ESTIMATE / PAYMENT METHOD.
export function SectionLabel({ children }: { children: string }) {
  return (
    <Txt className="font-bold text-[11px] text-faint" style={{ letterSpacing: 0.4 }}>
      {children}
    </Txt>
  );
}
