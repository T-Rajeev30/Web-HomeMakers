import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OnboardingLayout from "../components/OnboardingLayout";
import { Card, Chip } from "../components/Card";
import Button from "../components/Button";
import Icon from "../components/Icon";
import { STEPS, subscriptionPlans } from "../data/onboarding";
import { saveStep } from "../store/useOnboarding";

export default function SubscriptionSelect() {
  const navigate = useNavigate();
  const s = STEPS.subscription;
  const [selected, setSelected] = useState("premium");

  const submit = () => {
    saveStep("subscription", { plan: selected });
    navigate(s.next);
  };

  return (
    <OnboardingLayout step={s.step} stepLabel={s.label}>
      <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-2">
        Choose a plan
      </h2>
      <p className="text-body-md text-on-surface-variant mb-stack-lg">
        You can change or upgrade anytime after approval.
      </p>
      <section className="flex flex-col gap-stack-md">
        {subscriptionPlans.map((p) => {
          const active = selected === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelected(p.id)}
              className="text-left"
            >
              <Card
                className={`p-4 transition-all ${active ? "border-primary ring-1 ring-primary" : ""}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-headline-md font-headline-md text-on-surface">
                    {p.name}
                  </h3>
                  {active ? (
                    <Icon name="check_circle" className="text-primary" />
                  ) : (
                    <Chip tone="neutral">{p.tag}</Chip>
                  )}
                </div>
                <p className="text-label-lg font-label-lg text-primary mb-3">
                  {p.price}
                  <span className="text-on-surface-variant"> / {p.period}</span>
                </p>
                <ul className="space-y-1">
                  {p.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2 text-label-sm font-label-sm text-on-surface-variant"
                    >
                      <Icon name="done" className="text-[16px] text-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
              </Card>
            </button>
          );
        })}
      </section>
      <div className="mt-stack-lg">
        <Button full icon="arrow_forward" onClick={submit}>
          Continue
        </Button>
      </div>
    </OnboardingLayout>
  );
}
