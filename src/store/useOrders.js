import { useSyncExternalStore } from "react";
import api from "../services/api";

let state = { orders: [], loading: true, error: "" };
const listeners = new Set();
const emit = () => listeners.forEach((l) => l());
const subscribe = (l) => (listeners.add(l), () => listeners.delete(l));
const getSnapshot = () => state;

function setState(patch) {
  state = { ...state, ...patch };
  emit();
}

export async function fetchOrders() {
  setState({ loading: true, error: "" });
  try {
    const { data } = await api.get("/api/cook/orders", {
      params: { limit: 100 },
    });
    setState({ orders: data.items, loading: false });
  } catch (e) {
    setState({
      loading: false,
      error: e.response?.data?.error || "Failed to load orders.",
    });
  }
}

export async function updateOrderStatus(id, status, readyPhoto) {
  const body = readyPhoto ? { status, readyPhoto } : { status };
  const { data } = await api.patch(`/api/cook/orders/${id}/status`, body);
  setState({ orders: state.orders.map((o) => (o._id === id ? data : o)) });
  return data;
}

export function useOrders() {
  return useSyncExternalStore(subscribe, getSnapshot).orders;
}

export function useOrdersState() {
  return useSyncExternalStore(subscribe, getSnapshot);
}

export function useOrder(id) {
  return useOrders().find((o) => o._id === id);
}
