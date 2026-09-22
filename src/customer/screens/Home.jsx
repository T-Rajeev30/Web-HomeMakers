import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { catalog } from "../api/services";

export default function Home() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => load({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => load({}),
      { timeout: 4000 },
    ) ?? load({});
  }, []);

  async function load(params) {
    try {
      setData(await catalog.home(params));
    } catch (e) {
      setErr(e.body?.message || e.message);
    }
  }

  if (err) return <p className="zc-error">{err}</p>;
  if (!data) return <p className="zc-dim">Loading…</p>;

  return (
    <div className="zc-stack">
      <section>
        <h2>Nearby kitchens</h2>
        <div className="zc-row-scroll">
          {data.nearbyKitchens.map((k) => (
            <Link
              key={k._id}
              to={`/customer/cook/${k._id}`}
              className="zc-card zc-kitchen-card"
            >
              <div className="zc-thumb zc-grad-fallback" />
              <strong>{k.personal?.name}</strong>
              <span className="zc-dim">
                {k.food?.cuisine} · {(k.distanceMeters / 1000).toFixed(1)} km
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2>Popular dishes</h2>
        <div className="zc-row-scroll">
          {data.popularMeals.map((d) => (
            <div key={d._id} className="zc-card zc-dish-card">
              <div className="zc-thumb zc-grad-fallback" />
              <strong>{d.name}</strong>
              <span className="zc-dim">₹{d.price}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
