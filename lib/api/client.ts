import type { ApiError, AuthTokens } from "@/types/api";
import { API_URL } from "./config";
import { clearTokens, getTokens, setTokens } from "./tokens";

// A typed error carrying the backend's AllExceptionsFilter payload
// ({ statusCode, message, errors? }). Screens can branch on `status` (e.g. 401)
// and surface `errors` for field-level validation messages.
export class ApiRequestError extends Error implements ApiError {
  statusCode: number;
  errors?: Record<string, string[]>;
  constructor(body: ApiError) {
    super(body.message);
    this.name = "ApiRequestError";
    this.statusCode = body.statusCode;
    this.errors = body.errors;
  }
}

// Raised when the session can't be recovered (refresh failed / no tokens). The
// auth context listens for this to bounce the user back to the login screen.
export class AuthExpiredError extends Error {
  constructor() {
    super("Session expired");
    this.name = "AuthExpiredError";
  }
}

type Json = Record<string, unknown> | unknown[];

export type RequestOptions = {
  method?: string;
  // A JSON-serializable body. Mutually exclusive with `form`.
  body?: Json;
  // A multipart body (file uploads). Mutually exclusive with `body`.
  form?: FormData;
  query?: Record<string, string | number | boolean | undefined>;
  // Skip the Authorization header + 401-refresh (used by login/refresh).
  auth?: boolean;
  signal?: AbortSignal;
};

function buildUrl(path: string, query?: RequestOptions["query"]): string {
  const url = `${API_URL}${path}`;
  if (!query) return url;
  const qs = Object.entries(query)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join("&");
  return qs ? `${url}?${qs}` : url;
}

async function parse(res: Response): Promise<unknown> {
  if (res.status === 204) return undefined;
  const text = await res.text();
  if (!text) return undefined;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

// ── Single-flight refresh ────────────────────────────────────────────────────
// If several requests 401 at once, only one refresh call goes out; the rest
// await the same promise.
let refreshing: Promise<AuthTokens> | null = null;

async function refreshTokens(): Promise<AuthTokens> {
  const current = getTokens();
  if (!current) throw new AuthExpiredError();
  if (refreshing) return refreshing;

  refreshing = (async () => {
    const res = await fetch(buildUrl("/auth/refresh"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: current.refreshToken }),
    });
    if (!res.ok) {
      await clearTokens();
      throw new AuthExpiredError();
    }
    const data = (await parse(res)) as { tokens: AuthTokens };
    await setTokens(data.tokens);
    return data.tokens;
  })();

  try {
    return await refreshing;
  } finally {
    refreshing = null;
  }
}

async function send(path: string, opts: RequestOptions, accessToken?: string): Promise<Response> {
  const headers: Record<string, string> = {};
  if (opts.body !== undefined) headers["Content-Type"] = "application/json";
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  return fetch(buildUrl(path, opts.query), {
    method: opts.method ?? "GET",
    headers,
    body: opts.form ?? (opts.body !== undefined ? JSON.stringify(opts.body) : undefined),
    signal: opts.signal,
  });
}

// The single entry point for every API call. Attaches the Bearer token, and on
// a 401 transparently refreshes once and retries before giving up.
export async function request<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const withAuth = opts.auth !== false;
  let token = withAuth ? getTokens()?.accessToken : undefined;

  let res = await send(path, opts, token);

  if (res.status === 401 && withAuth) {
    const tokens = await refreshTokens(); // throws AuthExpiredError if it can't
    token = tokens.accessToken;
    res = await send(path, opts, token);
  }

  const data = await parse(res);

  if (!res.ok) {
    const body = (data ?? {}) as Partial<ApiError>;
    throw new ApiRequestError({
      statusCode: body.statusCode ?? res.status,
      message: body.message ?? res.statusText ?? "Request failed",
      errors: body.errors,
    });
  }

  return data as T;
}

// Convenience verbs.
export const api = {
  get: <T>(path: string, query?: RequestOptions["query"], signal?: AbortSignal) =>
    request<T>(path, { method: "GET", query, signal }),
  post: <T>(path: string, body?: Json) => request<T>(path, { method: "POST", body }),
  patch: <T>(path: string, body?: Json) => request<T>(path, { method: "PATCH", body }),
  del: <T>(path: string) => request<T>(path, { method: "DELETE" }),
  // Multipart POST (timeline photo/voice uploads).
  postForm: <T>(path: string, form: FormData) => request<T>(path, { method: "POST", form }),
};
