import { Icon } from "@/components/Icon";
import type { TickState } from "@/components/timeline/useTicks";

// The little status glyph shown at the end of one of the current user's own
// bubbles. WhatsApp-style: clock while sending, a red warning on failure, a
// single grey tick once sent, and blue double ticks once read.
//
// `onLight` renders inside light bubbles (photo/voice) where white glyphs would
// vanish; the default targets the orange comment bubble (white-ish glyphs).
export function Ticks({ state, onLight = false }: { state?: TickState; onLight?: boolean }) {
  if (!state) return null;
  const dim = onLight ? "#9CA3AF" : "rgba(255,255,255,0.75)";
  switch (state) {
    case "sending":
      return <Icon name="clock" size={11} color={dim} weight="bold" />;
    case "failed":
      return <Icon name="warning-circle" size={12} color="#F87171" weight="fill" />;
    case "sent":
      return <Icon name="check" size={13} color={dim} weight="bold" />;
    case "read":
      return <Icon name="checks" size={13} color="#34B7F1" weight="bold" />;
  }
}
