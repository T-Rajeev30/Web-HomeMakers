import { useState } from "react";
import TopAppBar from "../components/TopAppBar";
import { Card } from "../components/Card";
import Button from "../components/Button";
import Icon from "../components/Icon";
import { categories as seed } from "../data/mock";
import { BRAND_GRADIENT } from "../lib/brand";

export default function ManageCategories() {
  const [cats, setCats] = useState(seed);
  const [adding, setAdding] = useState("");

  const add = () => {
    const name = adding.trim();
    if (!name) return;
    setCats((c) => [...c, name]);
    setAdding("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <TopAppBar showBack title="Menu" />
      <main className="flex-1 px-margin-mobile pt-stack-md pb-32 animate-fade-in">
        <div className="flex items-center gap-4 mb-stack-lg">
          <div
            className="shrink-0 w-14 h-14 rounded-full flex items-center justify-center"
            style={{ background: BRAND_GRADIENT }}
          >
            <Icon name="category" className="text-white text-[26px]" />
          </div>
          <h2 className="text-headline-lg-mobile font-headline-lg-mobile text-on-surface">
            Manage Categories
          </h2>
        </div>

        <section className="flex flex-col gap-stack-sm">
          {cats.map((c) => (
            <Card key={c} className="p-4 flex items-center justify-between">
              <span className="text-body-md text-on-surface">{c}</span>
              <Icon name="chevron_right" className="text-on-surface-variant" />
            </Card>
          ))}
        </section>

        <div className="fixed bottom-6 left-0 right-0 px-margin-mobile flex gap-stack-sm">
          <input
            value={adding}
            onChange={(e) => setAdding(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && add()}
            placeholder="New category"
            className="flex-1 h-touch-target-min px-4 bg-surface-container-lowest border border-outline-variant rounded-lg outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
          <Button icon="add" iconRight={false} onClick={add}>
            Add
          </Button>
        </div>
      </main>
    </div>
  );
}
