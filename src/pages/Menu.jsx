import { useState } from "react";
import { Card } from "../components/Card";
import Icon from "../components/Icon";
import { dishes as seedDishes } from "../data/mock";

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={onChange}
      className={`relative w-11 h-6 rounded-full transition-colors ${
        checked ? "bg-primary" : "bg-outline-variant"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
          checked ? "translate-x-5" : ""
        }`}
      />
    </button>
  );
}

export default function Menu() {
  const [dishes, setDishes] = useState(seedDishes);
  const [query, setQuery] = useState("");

  const toggle = (idx) =>
    setDishes((d) => d.map((dish, i) => (i === idx ? { ...dish, available: !dish.available } : dish)));

  const filtered = dishes.filter((d) => d.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <main className="px-margin-mobile pt-stack-md space-y-stack-lg animate-fade-in">
      <section>
        <h2 className="text-headline-lg-mobile font-headline-lg-mobile text-on-surface">Menu Management</h2>
        <p className="text-on-surface-variant font-body-md">Manage your daily home-cooked offerings</p>
      </section>

      <section className="flex gap-stack-sm items-center">
        <div className="relative flex-grow">
          <Icon
            name="search"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search dishes..."
            className="w-full h-touch-target-min pl-12 pr-4 bg-surface-container-low border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
          />
        </div>
        <button className="w-touch-target-min h-touch-target-min flex items-center justify-center bg-surface-container border border-outline-variant rounded-xl active:scale-95 transition-transform">
          <Icon name="filter_list" className="text-on-surface-variant" />
        </button>
      </section>

      <section className="grid grid-cols-1 gap-stack-md">
        {filtered.map((dish, i) => (
          <Card key={dish.name} className="overflow-hidden flex flex-col">
            <div className="relative h-32 bg-surface-container-high flex items-center justify-center">
              <Icon name="restaurant" className="text-[48px] text-outline" />
              {dish.tag && (
                <span className="absolute top-2 right-2 bg-primary-container text-on-primary px-2 py-1 rounded-lg text-label-sm font-label-sm shadow-card">
                  {dish.tag}
                </span>
              )}
            </div>
            <div className="p-4 flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <h3 className="text-headline-md font-headline-md text-on-surface">{dish.name}</h3>
                <span className="text-headline-md font-headline-md text-primary">{dish.price}</span>
              </div>
              <p className="text-on-surface-variant text-body-md line-clamp-2">{dish.desc}</p>
              <div className="pt-4 border-t border-outline-variant flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-label-lg font-label-lg text-on-surface-variant">
                    {dish.available ? "Available" : "Sold Out"}
                  </span>
                  <Toggle checked={dish.available} onChange={() => toggle(i)} />
                </div>
                <button className="flex items-center gap-1 text-primary font-label-lg px-2 py-1 rounded-lg hover:bg-surface-container-high transition-colors">
                  <Icon name="edit" className="text-[20px]" /> Edit
                </button>
              </div>
            </div>
          </Card>
        ))}
      </section>
    </main>
  );
}
