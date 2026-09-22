import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cart as cartApi } from "../api/services";

export default function Cart() {
  const nav = useNavigate();
  const [c, setC] = useState(null);
  const [err, setErr] = useState("");

  const refresh = () =>
    cartApi
      .get()
      .then(setC)
      .catch((e) => setErr(e.body?.message || e.message));
  useEffect(() => {
    refresh();
  }, []);

  const setQty = async (dishId, qty) => {
    if (qty < 1) return remove(dishId);
    await cartApi.setQty(dishId, qty);
    refresh();
  };
  const remove = async (dishId) => {
    await cartApi.remove(dishId);
    refresh();
  };
  const clear = async () => {
    await cartApi.clear();
    refresh();
  };

  if (err) return <p className="zc-error">{err}</p>;
  if (!c) return <p className="zc-dim">Loading…</p>;

  if (!c.cookId) {
    return (
      <div className="zc-empty">
        <span className="material-symbols-rounded">shopping_bag</span>
        <p>Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="zc-stack">
      <div className="zc-row-between">
        <h1>{c.cookName}</h1>
        <button className="zc-link" onClick={clear}>
          Clear cart
        </button>
      </div>

      <div className="zc-stack-sm">
        {c.items.map((item) => (
          <div key={item.dishId} className="zc-card zc-cart-row">
            <div className="zc-dish-info">
              <strong>{item.name}</strong>
              {!item.available && (
                <span className="zc-error">
                  Unavailable — remove to continue
                </span>
              )}
              <span className="zc-dim">₹{item.price}</span>
            </div>
            <div className="zc-stepper">
              <button onClick={() => setQty(item.dishId, item.qty - 1)}>
                −
              </button>
              <span>{item.qty}</span>
              <button onClick={() => setQty(item.dishId, item.qty + 1)}>
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="zc-card zc-summary">
        {c.isCluster && (
          <p className="zc-dim">
            Bulk discount applied: {c.clusterDiscountPercent}%
          </p>
        )}
        <div className="zc-row-between">
          <span>Subtotal</span>
          <strong>₹{c.subtotal}</strong>
        </div>
      </div>

      <button
        className="zc-btn"
        disabled={c.items.some((i) => !i.available)}
        onClick={() => nav("/customer/checkout")}
      >
        Proceed to checkout
      </button>
    </div>
  );
}
