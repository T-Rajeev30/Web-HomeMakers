import { useCategories } from "../hooks/useCategories";

export default function CategorySelect({ value, onChange, required = true }) {
  const { categories, loading } = useCategories();

  return (
    <div>
      <label
        htmlFor="category"
        className="block mb-2 text-label-lg font-label-lg text-on-surface-variant"
      >
        Category
      </label>
      <select
        id="category"
        value={value || ""}
        onChange={(e) => {
          const cat = categories.find((c) => c._id === e.target.value);
          onChange(cat || null);
        }}
        required={required}
        disabled={loading}
        className="w-full h-touch-target-min px-4 rounded-lg bg-surface-container-lowest border border-outline-variant text-body-md text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all disabled:opacity-60"
      >
        <option value="" disabled>
          {loading ? "Loading categories…" : "Select category"}
        </option>
        {categories.map((c) => (
          <option key={c._id} value={c._id}>
            {c.name}
          </option>
        ))}
      </select>
      {!loading && categories.length === 0 && (
        <p className="mt-1 text-label-sm font-label-sm text-error">
          No categories available yet. Contact support to add one.
        </p>
      )}
    </div>
  );
}
