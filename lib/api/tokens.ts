import * as SecureStore from "expo-secure-store";
import type { AuthTokens } from "@/types/api";

// JWT access + refresh tokens, persisted in the encrypted Keychain/Keystore via
// expo-secure-store. The pair is well under the ~2KB iOS item limit. We also
// keep an in-memory copy so the request path doesn't await SecureStore on every
// call (and so it survives a SecureStore hiccup mid-session).

const ACCESS_KEY = "gf.accessToken";
const REFRESH_KEY = "gf.refreshToken";

let cache: AuthTokens | null = null;

export async function loadTokens(): Promise<AuthTokens | null> {
  if (cache) return cache;
  const [accessToken, refreshToken] = await Promise.all([
    SecureStore.getItemAsync(ACCESS_KEY),
    SecureStore.getItemAsync(REFRESH_KEY),
  ]);
  if (accessToken && refreshToken) {
    cache = { accessToken, refreshToken };
    return cache;
  }
  return null;
}

export function getTokens(): AuthTokens | null {
  return cache;
}

export async function setTokens(tokens: AuthTokens): Promise<void> {
  cache = tokens;
  await Promise.all([
    SecureStore.setItemAsync(ACCESS_KEY, tokens.accessToken),
    SecureStore.setItemAsync(REFRESH_KEY, tokens.refreshToken),
  ]);
}

export async function clearTokens(): Promise<void> {
  cache = null;
  await Promise.all([
    SecureStore.deleteItemAsync(ACCESS_KEY),
    SecureStore.deleteItemAsync(REFRESH_KEY),
  ]);
}
