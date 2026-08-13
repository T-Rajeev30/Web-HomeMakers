import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Chip } from "../components/Card";
import Button from "../components/Button";
import Icon from "../components/Icon";
import { useOrder, fetchOrders, updateOrderStatus } from "../store/useOrders";
import {
  FLOW,
  statusMeta,
  primaryAction,
  orderTypeMeta,
} from "../data/orderStatus";
import { BRAND_GRADIENT } from "../lib/brand";

const inr = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

const steps = [
  { key: "pending", label: "Accepted", icon: "receipt_long" },
  { key: "preparing", label: "Preparing", icon: "skillet" },
  { key: "ready", label: "Ready", icon: "shopping_bag" },
  { key: "completed", label: "Picked Up", icon: "local_shipping" },
];

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const order = useOrder(id);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    fetchOrders().finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <main className="flex-1 px-margin-mobile pt-16 text-center animate-fade-in">
        <p className="text-body-md text-on-surface-variant">Loading…</p>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="flex-1 px-margin-mobile pt-16 text-center animate-fade-in">
        <p className="text-body-md text-on-surface-variant">Order not found.</p>
        <Button
          variant="text"
          onClick={() => navigate("/orders")}
          className="mt-4"
        >
          Back to Orders
        </Button>
      </main>
    );
  }

  const meta = statusMeta[order.status];
  const action = primaryAction[order.status];
  const activeIndex = FLOW.indexOf(order.status);
  const isRejected = order.status === "rejected";

  const update = async (status) => {
    setErr("");
    setUpdating(true);
    try {
      await updateOrderStatus(order._id, status);
      if (status === "rejected" || status === "completed") navigate("/orders");
    } catch (e) {
      setErr(e.response?.data?.error || "Failed to update order.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <main className="flex-1 px-margin-mobile pt-stack-md pb-32 animate-fade-in">
      <button
        onClick={() => navigate("/orders")}
        className="flex items-center gap-1 text-on-surface-variant mb-stack-md active:scale-95"
      >
        <Icon name="arrow_back" />{" "}
        <span className="text-label-lg font-label-lg">Orders</span>
      </button>

      <Card className="p-4 mb-stack-md">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="font-headline-md text-headline-md text-on-surface">
              {order.customerName || "Customer"}
            </h2>
            <p className="text-label-sm font-label-sm text-outline">
              Order ID: {order._id.slice(-8).toUpperCase()}
            </p>
            <p className="text-label-sm font-label-sm text-outline">
              {order.customerPhone}
            </p>
          </div>
          <Chip tone={meta.chip}>{meta.label}</Chip>
        </div>
        {order.isCluster && (
          <div className="mt-2 flex items-center gap-1.5 text-label-lg font-label-lg text-primary">
            <Icon name="groups" className="text-[18px]" />
            Cluster Order · {order.clusterDiscountPercent}% discount applied
          </div>
        )}
      </Card>

      {!isRejected && (
        <Card className="p-4 mb-stack-md">
          <div className="flex justify-between">
            {steps.map((s, i) => {
              const done = i <= activeIndex;
              return (
                <div
                  key={s.key}
                  className="flex-1 flex flex-col items-center gap-1 relative"
                >
                  {i > 0 && (
                    <span
                      className="absolute top-5 right-1/2 w-full h-0.5"
                      style={{
                        background:
                          i <= activeIndex
                            ? BRAND_GRADIENT
                            : "var(--surface-container-highest, #e5e5e5)",
                      }}
                    />
                  )}
                  <div
                    className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: done ? BRAND_GRADIENT : undefined }}
                  >
                    {!done && (
                      <span className="absolute inset-0 rounded-full bg-surface-container-highest" />
                    )}
                    <Icon
                      name={s.icon}
                      className={`relative text-[20px] ${
                        done ? "text-white" : "text-outline"
                      }`}
                    />
                  </div>
                  <span
                    className={`text-label-sm font-label-sm ${
                      done ? "text-on-surface" : "text-outline"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {order.deliveryAddress && (
        <Card className="p-4 mb-stack-md">
          <h3 className="font-label-lg text-label-lg text-on-surface-variant mb-2">
            Delivery Address
          </h3>
          <p className="text-body-md text-on-surface">
            {[
              order.deliveryAddress.building,
              order.deliveryAddress.locality,
              order.deliveryAddress.pincode,
            ]
              .filter(Boolean)
              .join(", ")}
          </p>
        </Card>
      )}

      <Card className="p-4 mb-stack-md">
        <h3 className="font-label-lg text-label-lg text-on-surface-variant mb-3">
          Order Items
        </h3>
        <div className="space-y-2">
          {order.items.map((item, i) => (
            <div
              key={i}
              className="flex justify-between items-center text-body-md"
            >
              <span>
                {item.name} × {item.qty}
              </span>
              <span className="text-on-surface-variant">
                {inr(item.price * item.qty)}
              </span>
            </div>
          ))}
        </div>
        <div className="pt-3 mt-3 border-t border-outline-variant space-y-1">
          {order.isCluster && (
            <div className="flex justify-between items-center text-label-sm font-label-sm text-on-surface-variant">
              <span>Subtotal</span>
              <span>{inr(order.subtotal)}</span>
            </div>
          )}
          {order.isCluster && (
            <div className="flex justify-between items-center text-label-sm font-label-sm text-primary">
              <span>Cluster discount ({order.clusterDiscountPercent}%)</span>
              <span>-{inr(order.subtotal - order.total)}</span>
            </div>
          )}
          <div className="flex justify-between items-center">
            <span className="text-label-sm font-label-sm text-outline">
              Total Amount
            </span>
            <span className="text-headline-md font-headline-md text-primary">
              {inr(order.total)}
            </span>
          </div>
        </div>
      </Card>

      {err && (
        <div className="flex items-center gap-2 text-error px-4 py-3 bg-error-container rounded-lg mb-stack-md">
          <Icon name="error" className="text-base" />
          <span className="text-label-lg font-label-lg">{err}</span>
        </div>
      )}

      <div className="fixed bottom-24 left-0 right-0 px-margin-mobile">
        {order.status === "pending" ? (
          <div className="flex gap-3">
            <Button
              variant="outline"
              full
              onClick={() => update("rejected")}
              icon="close"
              iconRight={false}
              disabled={updating}
            >
              Reject
            </Button>
            <Button
              full
              onClick={() => update(action.next)}
              icon={action.icon}
              iconRight={false}
              disabled={updating}
            >
              {updating ? "Updating..." : action.label}
            </Button>
          </div>
        ) : action ? (
          <Button
            full
            onClick={() => update(action.next)}
            icon={action.icon}
            iconRight={false}
            disabled={updating}
          >
            {updating ? "Updating..." : action.label}
          </Button>
        ) : (
          <Card className="p-3 text-center">
            <p className="text-label-lg font-label-lg text-on-surface-variant">
              {isRejected ? "Order rejected" : "Order completed"}
            </p>
          </Card>
        )}
      </div>
    </main>
  );
}
