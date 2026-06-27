import Constants from "expo-constants";

// Base URL for the GarageFlow API. Resolved (in order) from:
//   1. EXPO_PUBLIC_API_URL env var (override without editing app.json)
//   2. app.json → expo.extra.apiUrl (the committed default — a LAN IP so a
//      physical device on the same Wi-Fi can reach the local NestJS server)
//   3. http://localhost:3000/api (simulator / web fallback)
//
// On a physical device, localhost points at the phone, not your Mac — set the
// LAN IP in app.json's extra.apiUrl (or EXPO_PUBLIC_API_URL).
const fromExtra = (Constants.expoConfig?.extra as { apiUrl?: string } | undefined)?.apiUrl;

export const API_URL =
  process.env.EXPO_PUBLIC_API_URL ?? fromExtra ?? "http://localhost:3000/api";
