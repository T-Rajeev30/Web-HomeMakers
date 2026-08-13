import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OnboardingLayout from "../components/OnboardingLayout";
import { Card } from "../components/Card";
import TextField from "../components/TextField";
import Button from "../components/Button";
import Icon from "../components/Icon";
import { STEPS, cuisines, foodCategories } from "../data/onboarding";
import { saveStep } from "../store/useOnboarding";
import api from "../services/api";
import { BRAND_GRADIENT } from "../lib/brand";

function Select({ label, id, options, value, onChange, placeholder }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block mb-2 text-label-lg font-label-lg text-on-surface-variant"
      >
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={onChange}
        required
        className="w-full h-touch-target-min px-4 rounded-lg bg-surface-container-lowest border border-outline-variant text-body-md text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function KitchenInformation() {
  const navigate = useNavigate();
  const s = STEPS.kitchen;
  const [form, setForm] = useState({ cuisine: "", category: "", capacity: "" });
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setSaving(true);
    try {
      await api.post("/api/onboarding/draft", { step: "kitchen", data: form });
      saveStep("kitchen", form);
      navigate(s.next);
    } catch (error) {
      setErr(
        error.response?.data?.error ||
          error.response?.data?.details?.[0]?.message ||
          "Failed to save. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <OnboardingLayout step={s.step} stepLabel={s.label}>
      <Card className="p-6">
        <div className="flex items-center gap-4 mb-stack-lg">
          <div
            className="shrink-0 w-14 h-14 rounded-full flex items-center justify-center"
            style={{ background: BRAND_GRADIENT }}
          >
            <Icon name="soup_kitchen" className="text-white text-[26px]" />
          </div>
          <div>
            <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-1">
              Kitchen capacity
            </h2>
            <p className="text-body-md text-on-surface-variant">
              How much can your kitchen handle in a day?
            </p>
          </div>
        </div>

        <form className="space-y-stack-lg" onSubmit={submit}>
          <Select
            label="Cuisine Type"
            id="cuisine"
            options={cuisines}
            value={form.cuisine}
            onChange={set("cuisine")}
            placeholder="Select cuisine type"
          />
          <Select
            label="Food Category"
            id="category"
            options={foodCategories}
            value={form.category}
            onChange={set("category")}
            placeholder="Select food category"
          />
          <TextField
            label="Cooking Capacity (per day)"
            id="capacity"
            inputMode="numeric"
            placeholder="e.g. 20 meals"
            value={form.capacity}
            onChange={set("capacity")}
            required
          />

          {err && (
            <div className="flex items-center gap-2 text-error px-4 py-3 bg-error-container rounded-lg">
              <Icon name="error" className="text-base" />
              <span className="text-label-lg font-label-lg">{err}</span>
            </div>
          )}

          <Button full icon="arrow_forward" type="submit" disabled={saving}>
            {saving ? "Saving..." : "Continue"}
          </Button>
        </form>
      </Card>
    </OnboardingLayout>
  );
}
