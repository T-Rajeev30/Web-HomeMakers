import TopAppBar from "./TopAppBar";
import { ProgressBar } from "./Card";

/** Layout for multi-step onboarding screens (personal info, documents...). */
export default function OnboardingLayout({ step, totalSteps = 8, stepLabel, children }) {
  const pct = (step / totalSteps) * 100;
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <TopAppBar showBack logo />
      <main className="flex-grow w-full max-w-xl mx-auto px-margin-mobile py-stack-lg">
        <div className="mb-stack-lg">
          <div className="flex justify-between items-center mb-stack-sm">
            <span className="text-label-sm font-label-sm text-primary font-bold">
              Step {step} of {totalSteps}
            </span>
            <span className="text-label-sm font-label-sm text-on-surface-variant">{stepLabel}</span>
          </div>
          <ProgressBar value={pct} />
        </div>
        {children}
      </main>
    </div>
  );
}
