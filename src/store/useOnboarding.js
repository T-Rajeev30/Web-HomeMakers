import { useSyncExternalStore } from "react";

const KEY = "zingro-onboarding";
const load = () => {
  try {
    return JSON.parse(sessionStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
};

let state = load();
const listeners = new Set();
const emit = () => {
  sessionStorage.setItem(KEY, JSON.stringify(state));
  listeners.forEach((l) => l());
};
const subscribe = (l) => (listeners.add(l), () => listeners.delete(l));
const getSnapshot = () => state;

/** Merge a step's data into the onboarding draft. */
export const saveStep = (key, data) => {
  state = { ...state, [key]: { ...(state[key] || {}), ...data } };
  emit();
};
export const resetOnboarding = () => {
  state = {};
  emit();
};

export function useOnboarding() {
  return useSyncExternalStore(subscribe, getSnapshot);
}
