# Wiring the Expo app to the GarageFlow API

The app talks to the NestJS backend (`../garageflow-backend`) through a typed
fetch client + **TanStack Query**. Every screen reads live server data; the old
`data/mock.ts` fixtures are gone.

## Contract

[`types/api.ts`](types/api.ts) is the single source of truth for the serialized
shapes. The backend's serializers mirror it exactly — if a field looks wrong,
the fix is in the backend serializer, not the screen.

## Configuration

The API base URL is resolved in [`lib/api/config.ts`](lib/api/config.ts):

1. `EXPO_PUBLIC_API_URL` env var, else
2. `app.json` → `expo.extra.apiUrl` (committed default — a **LAN IP** so a
   physical device on the same Wi-Fi reaches your Mac), else
3. `http://localhost:3000/api`.

> On a physical device, `localhost` is the phone. Set `extra.apiUrl` in
> `app.json` to your machine's LAN IP (e.g. `http://192.168.0.106:3000/api`), or
> export `EXPO_PUBLIC_API_URL`.

## Layers (`lib/api/`)

| File | Role |
| --- | --- |
| `config.ts` | base-URL resolution |
| `tokens.ts` | access/refresh JWTs in `expo-secure-store` (+ in-memory cache) |
| `client.ts` | typed `fetch`: Bearer header, transparent **single-flight 401 → refresh → retry**, `ApiRequestError`/`AuthExpiredError`, multipart helper |
| `endpoints.ts` | one typed function per route |
| `queryClient.ts` | the `QueryClient` + the `qk` query-key factory |
| `hooks/queries.ts` | `useJobs`, `useJob`, `useApprovals`, `useInvoices`, finance reports, `useCatalogue`, `useTeam`, `useDashboard`, … |
| `hooks/mutations.ts` | `useRecordPayment`, `useAddExpense`, `useDecideApproval`, `usePostTimeline`, `useAddParts`, `useUpdateJob`, `useCreateJob` |
| `hooks/useJobChat.ts` | API-backed job timeline (optimistic), same interface the Composer/ChatFeed already used |

Providers are wired in [`app/_layout.tsx`](app/_layout.tsx):
`QueryClientProvider` → `AuthProvider`.

## Auth

[`lib/auth.tsx`](lib/auth.tsx) holds the session. `login(email, password)` hits
`POST /auth/login`, stores the rotating tokens, and the login screen routes by
the returned role (`ROLE_HOME`). On cold start, a stored refresh token restores
the session via `GET /auth/me`. `logout()` revokes + clears.

Dev logins (password `password123`): `admin@garageflow.test`,
`manager@garageflow.test`, `arjun@garageflow.test` (tech). RBAC is enforced
server-side — a tech is 403 on finance/approvals/team.

## Run it

```bash
# backend (separate terminal) — see ../garageflow-backend/README.md
cd ../garageflow-backend && npm run start:dev   # http://localhost:3000/api

# app
npm run typecheck      # clean
npm start              # set extra.apiUrl to your LAN IP for a device
```

## Known follow-ups

- **New Job Card** (`app/job/new.tsx`) is still the visual mockup; `useCreateJob`
  exists but the real form (vehicle/customer search + line-item editor) is a
  follow-up.
- A job's linked invoice id isn't surfaced on the job detail, so the job-screen
  "Invoice" button can't deep-link yet (open invoices from the Finances tab).
