# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v56.0.0/ before writing any code.

# Component-based architecture

Screens in `app/` are composition only — they wire data to components and own
navigation. They must NOT contain inline UI building blocks (message rows,
cards, list items, switch statements that render JSX, etc.).

When you build UI, follow these rules:

- **Extract, don't inline.** Any reusable or self-contained piece of UI lives in
  its own file under `components/`. A screen file should read like a layout, not
  an implementation. If you write a local `function Foo()` that returns JSX and
  it's more than a thin wrapper, move it to `components/`.
- **Group by feature.** Put related components in a folder, e.g. chat lives in
  `components/chat/` (`Chat.tsx` primitives, `ChatMessage.tsx`, `ChatFeed.tsx`,
  `Composer.tsx`, `useChat.ts`). Generic primitives go in `components/ui/`.
- **State lives in hooks, not screens.** Local interactive state (lists,
  drafts, timers) belongs in a `use*` hook colocated with its feature so screens
  stay declarative and the logic is reusable/testable.
- **Components own their interactivity.** A component manages its own internal
  state (e.g. `Composer` holds the draft text) and communicates outward via
  callback props (`onSend`, `onCancel`). Screens pass data in and handle events.
- **One responsibility per file.** Prefer several small focused components over
  one large one. Keep presentational primitives (`Bubble`, `Row`) separate from
  the components that arrange them (`ChatMessage`, `ChatFeed`).
- Reuse existing primitives in `components/ui/` (`Txt`, `Icon`, `Button`,
  `Avatar`, …) and theme tokens in `lib/theme.ts` — don't hardcode duplicates.
