import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Chip } from "../components/Card";
import Icon from "../components/Icon";
import { useOrdersState, fetchOrders } from "../store/useOrders";
import { statusMeta, orderTypeMeta } from "../data/orderStatus";
import { BRAND_GRADIENT } from "../lib/brand";

const tabs = ["New", "Active", "History"];
const inr = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

export default function Orders() {
  const [tab, setTab] = useState("New");
  const navigate = useNavigate();
  const { orders, loading, error } = useOrdersState();

  useEffect(() => {
    fetchOrders();
  }, []);

  const visible = orders.filter((o) => statusMeta[o.status]?.tab === tab);

  return (
    <main className="flex-1 px-margin-mobile pt-stack-md animate-fade-in">
      <nav className="flex items-center gap-2 py-stack-md sticky top-touch-target-min bg-surface z-30 overflow-x-auto hide-scrollbar">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-6 py-2 rounded-full font-label-lg text-label-lg transition-all active:scale-95 ${
              tab === t
                ? "text-white shadow-card"
                : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
            }`}
            style={tab === t ? { background: BRAND_GRADIENT } : undefined}
          >
            {t}
          </button>
        ))}
      </nav>

      {error && (
        <p className="text-label-sm font-label-sm text-error mb-stack-md">
          {error}
        </p>
      )}
      {loading && (
        <p className="text-body-md text-on-surface-variant">Loading orders…</p>
      )}

      <section className="flex flex-col gap-stack-md">
        {!loading && visible.length === 0 && (
          <div className="text-center text-on-surface-variant py-16">
            <p className="text-body-md">
              No {tab.toLowerCase()} orders right now.
            </p>
          </div>
        )}

        {visible.map((order) => {
          const meta = statusMeta[order.status];
          return (
            <Card
              key={order._id}
              onClick={() => navigate(`/orders/${order._id}`)}
              className="p-4 cursor-pointer hover:shadow-lg transition-shadow active:scale-[0.99]"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-headline-md text-headline-md text-on-surface">
                    {order.customerName || "Customer"}
                  </h3>
                  <p className="text-label-sm font-label-sm text-outline">
                    Order ID: {order._id.slice(-8).toUpperCase()}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Chip tone={meta.chip}>{meta.label}</Chip>
                  {order.isCluster && (
                    <span className="flex items-center gap-1 text-label-sm font-label-sm text-primary">
                      <Icon name="groups" className="text-[14px]" /> Cluster ·{" "}
                      {order.clusterDiscountPercent}% off
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-1 mb-4">
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

              <div className="pt-3 border-t border-outline-variant flex justify-between items-center">
                <div>
                  <p className="text-label-sm font-label-sm text-outline">
                    Total Amount
                  </p>
                  <p className="text-headline-md font-headline-md text-primary">
                    {inr(order.total)}
                  </p>
                </div>
                <Icon
                  name="chevron_right"
                  className="text-on-surface-variant"
                />
              </div>
            </Card>
          );
        })}
      </section>
    </main>
  );
}
