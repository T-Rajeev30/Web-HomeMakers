import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopAppBar from "../components/TopAppBar";
import TextField from "../components/TextField";
import Button from "../components/Button";
import Icon from "../components/Icon";
import { addPlan } from "../store/usePlans";
import { durations } from "../data/onboarding";
import { BRAND_GRADIENT } from "../lib/brand";

export default function CreatePlan() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    period: "",
    price: "",
    desc: "",
  });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    addPlan({
      id:
        form.name.trim().toLowerCase().replace(/\s+/g, "-") ||
        `plan-${Date.now()}`,
      name: form.name.trim(),
      price: form.price ? `₹${form.price}` : "₹0",
      period: form.period,
    });
    navigate("/plans");
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <TopAppBar showBack title="Plans" />
      <main className="flex-1 px-margin-mobile pt-stack-md pb-stack-lg animate-fade-in">
        <div className="flex items-center gap-4 mb-stack-lg">
          <div
            className="shrink-0 w-14 h-14 rounded-full flex items-center justify-center"
            style={{ background: BRAND_GRADIENT }}
          >
            <Icon name="subscriptions" className="text-white text-[26px]" />
          </div>
          <h2 className="text-headline-lg-mobile font-headline-lg-mobile text-on-surface">
            Create New Plan
          </h2>
        </div>

        <form className="space-y-stack-lg" onSubmit={submit}>
          <TextField
            label="Plan Name"
            id="name"
            value={form.name}
            onChange={set("name")}
            placeholder="e.g. Weekly Tiffin"
            required
          />

          <div>
            <label
              htmlFor="duration"
              className="block mb-2 text-label-lg font-label-lg text-on-surface-variant"
            >
              Duration
            </label>
            <select
              id="duration"
              value={form.period}
              onChange={set("period")}
              required
              className="w-full h-touch-target-min px-4 rounded-lg bg-surface-container-lowest border border-outline-variant text-body-md text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            >
              <option value="" disabled>
                Select duration
              </option>
              {durations.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <TextField
            label="Price (₹)"
            id="price"
            inputMode="numeric"
            value={form.price}
            onChange={set("price")}
            placeholder="0.00"
            required
          />

          <div>
            <label
              htmlFor="desc"
              className="block mb-2 text-label-lg font-label-lg text-on-surface-variant"
            >
              Description (Optional)
            </label>
            <textarea
              id="desc"
              value={form.desc}
              onChange={set("desc")}
              rows={3}
              placeholder="Plan description"
              className="w-full px-4 py-3 rounded-lg bg-surface-container-lowest border border-outline-variant text-body-md text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
            />
          </div>

          <Button full type="submit">
            Create Plan
          </Button>
        </form>
      </main>
    </div>
  );
}
