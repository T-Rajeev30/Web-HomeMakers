import { TOKEN_KEY, REFRESH_KEY, USER_KEY } from "../config";

const ls = {
  get: (k) => {
    try {
      return localStorage.getItem(k);
    } catch {
      return null;
    }
  },
  set: (k, v) => {
    try {
      localStorage.setItem(k, v);
    } catch {}
  },
  del: (k) => {
    try {
      localStorage.removeItem(k);
    } catch {}
  },
};

export const getToken = () => ls.get(TOKEN_KEY);
export const getRefresh = () => ls.get(REFRESH_KEY);
export const getUser = () => {
  try {
    return JSON.parse(ls.get(USER_KEY));
  } catch {
    return null;
  }
};

export function saveSession({ accessToken, refreshToken, user }) {
  if (accessToken) ls.set(TOKEN_KEY, accessToken);
  if (refreshToken) ls.set(REFRESH_KEY, refreshToken);
  if (user) ls.set(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  [TOKEN_KEY, REFRESH_KEY, USER_KEY].forEach(ls.del);
}

export function decodeJwt(token) {
  try {
    const p = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(decodeURIComponent(escape(atob(p))));
  } catch {
    return null;
  }
}

export function claims() {
  const t = getToken();
  if (!t) return null;
  const c = decodeJwt(t);
  if (!c) return null;
  if (c.exp && c.exp * 1000 < Date.now()) return { ...c, _expired: true };
  return c;
}

export const isAdmin = (c) => {
  const r = c?.role ?? c?.roles;
  return Array.isArray(r) ? r.includes("admin") : r === "admin";
};
