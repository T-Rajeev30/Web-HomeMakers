import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  addresses as addrApi,
  checkout as checkoutApi,
  orders as ordersApi,
} from "../api/services";
import { useRazorpay } from "../payments/useRazorpay";
import { getUser } from "../auth/session";

export default function Checkout() {
  const nav = useNavigate();
  const payWithRazorpay = useRazorpay();
  const user = getUser();

  const [addrs, setAddrs] = useState(null);
  const [addressId, setAddressId] = useState("");
  const [coupon, setCoupon] = useState("");
  const [breakdown, setBreakdown] = useState(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState("");

  useEffect(() => {
    addrApi
      .list()
      .then((list) => {
        setAddrs(list);
        const def = list.find((a) => a.isDefault) || list[0];
        if (def) setAddressId(def._id);
      })
      .catch((e) => setErr(e.body?.message || e.message));
  }, []);

  useEffect(() => {
    if (!addressId) return;
    setErr("");
    checkoutApi
      .preview(addressId, coupon || undefined)
      .then(setBreakdown)
      .catch((e) => {
        setBreakdown(null);
        setErr(e.body?.message || e.message);
      });
  }, [addressId, coupon]);

  async function payNow() {
    setBusy("pay");
    setErr("");
    try {
      const res = await payWithRazorpay({
        addressId,
        couponCode: coupon || undefined,
        customerName: user?.phone,
        contact: user?.phone,
      });
      nav(`/customer/orders/${res.zingroOrderId}`, { replace: true });
    } catch (e) {
      if (e.message !== "PAYMENT_CANCELLED")
        setErr(e.body?.message || e.message);
    } finally {
      setBusy("");
    }
  }

  async function placeNoPayment() {
    setBusy("cod");
    setErr("");
    const a = addrs.find((x) => x._id === addressId);
    try {
      const order = await ordersApi.placeNoPayment({
        orderType: "quick",
        deliveryAddress: {
          building: a.line1,
          locality: a.city,
          pincode: a.pincode,
        },
        customerName: user?.phone,
      });
      nav(`/customer/orders/${order._id}`, { replace: true });
    } catch (e) {
      setErr(e.body?.error || e.body?.message || e.message);
    } finally {
      setBusy("");
    }
  }

  if (err && !addrs) return <p className="zc-error">{err}</p>;
  if (!addrs) return <p className="zc-dim">Loading…</p>;

  if (!addrs.length) {
    return (
      <div className="zc-empty">
        <p>No saved address yet.</p>
        <p className="zc-dim">
          Address creation needs Google Maps billing, currently down — seed one
          directly in the DB to test checkout.
        </p>
      </div>
    );
  }

  return (
    <div className="zc-stack">
      <h1>Checkout</h1>

      <section>
        <h2 className="zc-section-title">Deliver to</h2>
        {addrs.map((a) => (
          <label key={a._id} className="zc-card zc-address-row">
            <input
              type="radio"
              checked={addressId === a._id}
              onChange={() => setAddressId(a._id)}
            />
            <div>
              <strong>{a.label || a.type}</strong>
              <p className="zc-dim">
                {a.line1}, {a.city} {a.pincode}
              </p>
            </div>
          </label>
        ))}
      </section>

      <section>
        <input
          className="zc-input"
          placeholder="Coupon code (optional)"
          value={coupon}
          onChange={(e) => setCoupon(e.target.value.toUpperCase())}
        />
      </section>

      {err && <p className="zc-error">{err}</p>}

      {breakdown && (
        <div className="zc-card zc-summary">
          <Row label="Subtotal" v={breakdown.subtotal} />
          <Row label="GST" v={breakdown.gst} />
          <Row label="Packing fee" v={breakdown.packingFee} />
          <Row label="Platform fee" v={breakdown.platformFee} />
          <Row
            label={`Delivery (${breakdown.deliveryDistanceKm} km)`}
            v={breakdown.deliveryFee}
          />
          {breakdown.couponDiscount > 0 && (
            <Row label="Coupon" v={-breakdown.couponDiscount} />
          )}
          <div className="zc-row-between zc-total">
            <span>Total</span>
            <strong>₹{breakdown.grandTotal}</strong>
          </div>
        </div>
      )}

      <button className="zc-btn" disabled={!breakdown || busy} onClick={payNow}>
        {busy === "pay"
          ? "Opening Razorpay…"
          : `Pay ₹${breakdown?.grandTotal ?? ""}`}
      </button>
      <button
        className="zc-btn zc-btn-ghost"
        disabled={!breakdown || busy}
        onClick={placeNoPayment}
      >
        {busy === "cod" ? "Placing…" : "Place order (no payment)"}
      </button>
    </div>
  );
}

const Row = ({ label, v }) => (
  <div className="zc-row-between zc-row-sm">
    <span className="zc-dim">{label}</span>
    <span>₹{v}</span>
  </div>
);
