import { API_ORIGIN } from "../config";
import { EP } from "./endpoints";
import {
  getToken,
  getRefresh,
  saveSession,
  clearSession,
} from "../auth/session";

export class ApiError extends Error {
  constructor(status, body, path) {
    super(body?.message || body?.error || `HTTP ${status}`);
    this.status = status;
    this.code = body?.code;
    this.body = body;
    this.path = path;
  }
}

// Wrapped modules return { success, message, data }; /api/public, /api/cart,
// /api/orders return the object directly. Unwrap only when the envelope is real.
const unwrap = (b) =>
  b && typeof b === "object" && "success" in b && "data" in b ? b.data : b;

async function raw(path, { method = "GET", body, params, token } = {}) {
  const url = new URL(API_ORIGIN + path, window.location.origin);
  if (params)
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, v);
    });

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let parsed = null;
  try {
    parsed = text ? JSON.parse(text) : null;
  } catch {
    parsed = { message: text };
  }
  return { res, parsed, path };
}

let refreshing = null;

async function tryRefresh() {
  const rt = getRefresh();
  if (!rt) return null;
  refreshing ||= (async () => {
    const { res, parsed } = await raw(EP.refresh, {
      method: "POST",
      body: { refreshToken: rt },
    });
    if (!res.ok) {
      clearSession();
      return null;
    }
    const d = parsed?.data || {};
    saveSession({ accessToken: d.accessToken, refreshToken: d.refreshToken });
    return d.accessToken || null;
  })().finally(() => {
    refreshing = null;
  });
  return refreshing;
}

export async function api(path, opts = {}) {
  let { res, parsed } = await raw(path, { ...opts, token: getToken() });

  if (res.status === 401 && !opts._retried) {
    const fresh = await tryRefresh();
    if (fresh) return api(path, { ...opts, _retried: true });
    clearSession();
  }

  if (!res.ok) throw new ApiError(res.status, parsed, path);
  return unwrap(parsed);
}

export const get = (p, params) => api(p, { method: "GET", params });
export const post = (p, body) => api(p, { method: "POST", body });
export const patch = (p, body) => api(p, { method: "PATCH", body });
export const del = (p) => api(p, { method: "DELETE" });
