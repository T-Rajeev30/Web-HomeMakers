import { useSyncExternalStore } from "react";
import api from "../services/api";
import { showToast } from "./useToast";

let state = { dishes: [], loading: true, error: "", savingId: null };
const listeners = new Set();
const emit = () => listeners.forEach((l) => l());
const subscribe = (l) => (listeners.add(l), () => listeners.delete(l));
const getSnapshot = () => state;

function setState(patch) {
  state = { ...state, ...patch };
  emit();
}

export async function fetchDishes() {
  setState({ loading: true, error: "" });
  try {
    const { data } = await api.get("/api/menu");
    setState({ dishes: data, loading: false });
  } catch (e) {
    setState({
      loading: false,
      error: e.response?.data?.error || "Failed to load menu.",
    });
  }
}

export async function addDish(payload) {
  const { data } = await api.post("/api/menu", payload);
  setState({ dishes: [data, ...state.dishes] });
  return data;
}

export async function updateDish(id, payload) {
  const { data } = await api.patch(`/api/menu/${id}`, payload);
  setState({ dishes: state.dishes.map((d) => (d._id === id ? data : d)) });
  return data;
}

export async function toggleDish(id) {
  const dish = state.dishes.find((d) => d._id === id);
  if (!dish) return;
  setState({ savingId: id });
  try {
    const { data } = await api.patch(`/api/menu/${id}`, {
      available: !dish.available,
    });
    setState({
      dishes: state.dishes.map((d) => (d._id === id ? data : d)),
      savingId: null,
    });
  } catch (e) {
    setState({ savingId: null });
    showToast("error", e.response?.data?.error || "Failed to update dish.");
  }
}

export async function deleteDish(id) {
  setState({ savingId: id });
  try {
    await api.delete(`/api/menu/${id}`);
    setState({
      dishes: state.dishes.filter((d) => d._id !== id),
      savingId: null,
    });
    showToast("success", "Dish deleted.");
  } catch (e) {
    setState({ savingId: null });
    showToast("error", e.response?.data?.error || "Failed to delete dish.");
  }
}

export function useDishes() {
  return useSyncExternalStore(subscribe, getSnapshot);
}
