import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { orders as ordersApi } from "../api/services";

export default function Orders() {
  const [list, setList] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    ordersApi
      .mine()
      .then((r) => setList(Array.isArray(r) ? r : r.items || []))
      .catch((e) => setErr(e.body?.error || e.body?.message || e.message));
  }, []);

  if (err) return <p className="zc-error">{err}</p>;
  if (!list) return <p className="zc-dim">Loading…</p>;
  if (!list.length) return <p className="zc-dim">No orders yet.</p>;

  return (
    <div className="zc-stack-sm">
      <h1>Your orders</h1>
      {list.map((o) => (
        <Link
          key={o._id}
          to={`/customer/orders/${o._id}`}
          className="zc-card zc-order-row"
        >
          <div>
            <strong>#{o._id.slice(-6)}</strong>
            <p className="zc-dim">{new Date(o.createdAt).toLocaleString()}</p>
          </div>
          <span className={`zc-status zc-status-${o.status}`}>{o.status}</span>
        </Link>
      ))}
    </div>
  );
}
