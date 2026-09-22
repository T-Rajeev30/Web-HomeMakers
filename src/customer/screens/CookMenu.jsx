import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { catalog, cart as cartApi } from "../api/services";
import { ApiError } from "../api/client";

const SECTION_ORDER = [
  "breakfast",
  "lunch",
  "dinner",
  "snacks",
  "desserts",
  "beverages",
  "uncategorized",
];

export default function CookMenu() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    catalog
      .menu(id)
      .then(setData)
      .catch((e) => setErr(e.body?.message || e.message));
  }, [id]);

  async function addToCart(dish) {
    setMsg("");
    try {
      await cartApi.add(data.cook._id, dish._id, 1);
      setMsg(`Added ${dish.name}`);
    } catch (e) {
      if (e instanceof ApiError && e.status === 409) {
        if (
          confirm(
            "Your cart has items from another kitchen. Clear it and add this instead?",
          )
        ) {
          await cartApi.add(data.cook._id, dish._id, 1, true);
          setMsg(`Added ${dish.name}`);
        }
      } else {
        setErr(e.body?.message || e.message);
      }
    }
  }

  if (err) return <p className="zc-error">{err}</p>;
  if (!data) return <p className="zc-dim">Loading…</p>;

  const sections = SECTION_ORDER.filter((k) => data.menu[k]?.length);

  return (
    <div className="zc-stack">
      <div>
        <h1>{data.cook.personal?.name}</h1>
        <p className="zc-dim">
          {data.cook.food?.cuisine} ·{" "}
          {data.cook.isOpenNow ? "Open now" : "Closed"}
        </p>
      </div>

      {msg && <p className="zc-toast">{msg}</p>}

      {sections.map((section) => (
        <section key={section}>
          <h2 className="zc-section-title">{section}</h2>
          <div className="zc-dish-list">
            {data.menu[section].map((dish) => (
              <div key={dish._id} className="zc-card zc-dish-row">
                <div className="zc-thumb zc-grad-fallback zc-thumb-sm" />
                <div className="zc-dish-info">
                  <strong>{dish.name}</strong>
                  {dish.desc && <span className="zc-dim">{dish.desc}</span>}
                  <span>
                    ₹{dish.price}
                    {dish.discount > 0 && (
                      <span className="zc-dim"> · {dish.discount}% off</span>
                    )}
                  </span>
                </div>
                <button
                  className="zc-btn zc-btn-sm"
                  onClick={() => addToCart(dish)}
                >
                  Add
                </button>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
