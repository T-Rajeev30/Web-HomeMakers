import { useNavigate } from "react-router-dom";
import { Card, Chip, ProgressBar } from "../components/Card";
import Button from "../components/Button";
import { usePlans } from "../store/usePlans";
import { BRAND_GRADIENT } from "../lib/brand";

export default function Plans() {
  const navigate = useNavigate();
  const plans = usePlans();
  return (
    <main className="px-margin-mobile pt-stack-md pb-stack-lg animate-fade-in">
      <section className="mb-stack-lg">
        <h2 className="text-headline-lg-mobile font-headline-lg-mobile text-on-surface">
          My Subscription Plans
        </h2>
        <p className="text-body-md text-on-surface-variant">
          Manage your active and available plans
        </p>
      </section>

      <section className="flex flex-col gap-stack-md">
        {plans.map((plan) => {
          const active = plan.status === "active";
          return (
            <Card
              key={plan.id}
              className="p-4"
              style={
                active
                  ? {
                      border: "2px solid transparent",
                      backgroundImage: `linear-gradient(var(--surface-container-lowest, #fff), var(--surface-container-lowest, #fff)), ${BRAND_GRADIENT}`,
                      backgroundOrigin: "border-box",
                      backgroundClip: "padding-box, border-box",
                    }
                  : undefined
              }
            >
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-headline-md font-headline-md text-on-surface">
                  {plan.name}
                </h3>
                <Chip tone={active ? "success" : "neutral"}>
                  {active ? "Active" : "Inactive"}
                </Chip>
              </div>
              <p className="text-label-sm font-label-sm text-on-surface-variant mb-3">
                {plan.price} / {plan.period}
              </p>
              <ProgressBar value={plan.progress} />
              <div className="flex justify-between mt-2 text-label-sm font-label-sm text-on-surface-variant">
                <span>{plan.used} days used</span>
                <span>{plan.note}</span>
              </div>
            </Card>
          );
        })}
      </section>

      <div className="mt-stack-lg">
        <Button
          full
          icon="add"
          iconRight={false}
          onClick={() => navigate("/plans/new")}
        >
          Create New Plan
        </Button>
      </div>
    </main>
  );
}
