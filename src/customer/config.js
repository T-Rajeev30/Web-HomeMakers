// Same-origin in prod (zingro.in). Vite proxy handles local dev.
export const API_ORIGIN = import.meta.env.VITE_API_ORIGIN || "";
export const TOKEN_KEY = "zc_access";
export const REFRESH_KEY = "zc_refresh";
export const USER_KEY = "zc_user";
