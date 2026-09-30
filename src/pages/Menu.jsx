import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../components/Card";
import Icon from "../components/Icon";
import {
  useDishes,
  fetchDishes,
  toggleDish,
  deleteDish,
} from "../store/useDishes";
import { BRAND_GRADIENT } from "../lib/brand";

function Toggle({ checked, onChange, disabled }) {
  return (
    <button
      onClick={onChange}
      disabled={disabled}
      className="relative w-11 h-6 rounded-full transition-colors disabled:opacity-50"
      style={{ background: checked ? BRAND_GRADIENT : undefined }}
      data-checked={checked}
    >
      {!checked && (
        <span className="absolute inset-0 rounded-full bg-outline-variant" />
      )}
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
          checked ? "translate-x-5" : ""
        }`}
      />
    </button>
  );
}

function RecipeSection({ recipe }) {
  const [open, setOpen] = useState(false);
  const hasRecipe =
    recipe?.ingredients?.length > 0 || recipe?.steps?.length > 0;

  if (!hasRecipe) return null;

  return (
    <div className="pt-3 border-t border-outline-variant">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between w-full text-label-lg font-label-lg text-on-surface-variant"
      >
        <span className="flex items-center gap-1.5">
          <Icon name="receipt_long" className="text-[18px]" />
          Recipe (SOP)
        </span>
        <Icon
          name={open ? "expand_less" : "expand_more"}
          className="text-[20px]"
        />
      </button>
      {open && (
        <div className="mt-3 space-y-3">
          {recipe.ingredients?.length > 0 && (
            <div>
              <p className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider mb-1.5">
                Ingredients
              </p>
              <ul className="space-y-1">
                {recipe.ingredients.map((item, i) => (
                  <li
                    key={i}
                    className="text-body-md text-on-surface flex items-start gap-2"
                  >
                    <span className="text-primary mt-1.5 w-1 h-1 rounded-full bg-primary shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {recipe.steps?.length > 0 && (
            <div>
              <p className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider mb-1.5">
                Preparation Steps
              </p>
              <ol className="space-y-1.5">
                {recipe.steps.map((step, i) => (
                  <li
                    key={i}
                    className="text-body-md text-on-surface flex items-start gap-2"
                  >
                    <span className="shrink-0 w-5 h-5 rounded-full bg-surface-container-high text-label-sm font-label-sm flex items-center justify-center">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Menu() {
  const { dishes, loading, error, savingId } = useDishes();
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchDishes();
  }, []);

  const filtered = dishes.filter((d) => {
    const q = query.toLowerCase();
    return (
      d.name.toLowerCase().includes(q) || d.category?.toLowerCase().includes(q)
    );
  });

  return (
    <main className="px-margin-mobile pt-stack-md space-y-stack-lg animate-fade-in pb-32">
      <section>
        <h2 className="text-headline-lg-mobile font-headline-lg-mobile text-on-surface">
          Menu Management
        </h2>
        <p className="text-on-surface-variant font-body-md">
          Manage your daily home-cooked offerings
        </p>
      </section>
      <section className="relative">
        <Icon
          name="search"
          className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]"
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search dishes or categories..."
          className="w-full h-touch-target-min pl-12 pr-4 bg-surface-container-low border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
        />
      </section>

      {error && (
        <p className="text-label-sm font-label-sm text-error">{error}</p>
      )}
      {loading && (
        <p className="text-body-md text-on-surface-variant">Loading menu…</p>
      )}
      {!loading && filtered.length === 0 && (
        <p className="text-center text-on-surface-variant py-16 text-body-md">
          No dishes yet. Tap + to add your first dish.
        </p>
      )}

      <section className="grid grid-cols-1 gap-stack-md">
        {filtered.map((dish) => (
          <Card key={dish._id} className="overflow-hidden flex flex-col">
            <div className="relative h-32 bg-surface-container-high flex items-center justify-center">
              {dish.imageUrl ? (
                <img
                  src={dish.imageUrl}
                  alt={dish.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Icon name="restaurant" className="text-[48px] text-outline" />
              )}
              {dish.tag && (
                <span
                  className="absolute top-2 right-2 text-white px-2 py-1 rounded-lg text-label-sm font-label-sm shadow-card"
                  style={{ background: BRAND_GRADIENT }}
                >
                  {dish.tag}
                </span>
              )}
            </div>
            <div className="p-4 flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-headline-md font-headline-md text-on-surface">
                    {dish.name}
                  </h3>
                  {dish.category && (
                    <span className="text-label-sm font-label-sm text-on-surface-variant">
                      {dish.category}
                    </span>
                  )}
                </div>
                <span className="text-headline-md font-headline-md text-primary">
                  ₹{dish.price}
                </span>
              </div>
              <p className="text-on-surface-variant text-body-md line-clamp-2">
                {dish.desc}
              </p>

              <RecipeSection recipe={dish.recipe} />

              <div className="pt-4 border-t border-outline-variant flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-label-lg font-label-lg text-on-surface-variant">
                    {dish.available ? "Available" : "Sold Out"}
                  </span>
                  <Toggle
                    checked={dish.available}
                    disabled={savingId === dish._id}
                    onChange={() => toggleDish(dish._id)}
                  />
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => navigate(`/menu/edit/${dish._id}`)}
                    className="flex items-center gap-1 text-primary font-label-lg px-2 py-1 rounded-lg hover:bg-surface-container-high transition-colors"
                  >
                    <Icon name="edit" className="text-[20px]" /> Edit
                  </button>
                  <button
                    disabled={savingId === dish._id}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (
                        confirm(`Delete "${dish.name}"? This can't be undone.`)
                      ) {
                        deleteDish(dish._id);
                      }
                    }}
                    className="flex items-center gap-1 text-error font-label-lg px-2 py-1 rounded-lg hover:bg-error-container transition-colors disabled:opacity-50"
                  >
                    <Icon name="delete" className="text-[20px]" />
                  </button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </section>

      <button
        onClick={() => navigate("/menu/add")}
        aria-label="Add new dish"
        className="fixed bottom-28 right-margin-mobile w-14 h-14 rounded-full text-white shadow-modal flex items-center justify-center active:scale-95 transition-transform z-40"
        style={{ background: BRAND_GRADIENT }}
      >
        <Icon name="add" className="text-[28px]" />
      </button>
    </main>
  );
}
