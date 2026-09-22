import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { orders as ordersApi, tracking as trackApi } from "../api/services";

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [live, setLive] = useState(null);
  const [err, setErr] = useState("");

  const load = () =>
    ordersApi
      .one(id)
      .then(setOrder)
      .catch((e) => setErr(e.body?.error || e.message));
  useEffect(() => {
    load();
  }, [id]);

  async function cancel() {
    if (!confirm("Cancel this order?")) return;
    try {
      await ordersApi.cancel(id);
      load();
    } catch (e) {
      setErr(e.body?.message || e.message);
    }
  }

  async function refreshTracking() {
    try {
      setLive(await trackApi.get(id));
    } catch (e) {
      setErr(e.body?.message || e.message);
    }
  }

  if (err) return <p className="zc-error">{err}</p>;
  if (!order) return <p className="zc-dim">Loading…</p>;

  return (
    <div className="zc-stack">
      <h1>Order #{order._id.slice(-6)}</h1>
      <span className={`zc-status zc-status-${order.status}`}>
        {order.status}
      </span>

      <div className="zc-card zc-summary">
        {(order.items || []).map((i) => (
          <div key={i.dishId || i._id} className="zc-row-between zc-row-sm">
            <span>
              {i.name} × {i.qty}
            </span>
            <span>₹{i.lineTotal ?? i.price * i.qty}</span>
          </div>
        ))}
        <div className="zc-row-between zc-total">
          <span>Total</span>
          <strong>₹{order.total ?? order.grandTotal}</strong>
        </div>
      </div>

      {order.status === "pending" && (
        <button className="zc-btn zc-btn-ghost" onClick={cancel}>
          Cancel order
        </button>
      )}

      <button className="zc-link" onClick={refreshTracking}>
        Check delivery status
      </button>
      {live && (
        <p className="zc-dim">
          {live.deliveryPartner?.name
            ? `${live.deliveryPartner.name} · ${live.deliveryPartner.phone}`
            : "No delivery partner assigned yet"}
        </p>
      )}
    </div>
  );
}
