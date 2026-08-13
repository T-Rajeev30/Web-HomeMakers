import { Card } from "./Card";
import Button from "./Button";
import Icon from "./Icon";
import { BRAND_GRADIENT } from "../lib/brand";

// Error stays a plain semantic red — it shouldn't borrow the celebratory
// brand gradient. Success and pending both get the gradient treatment,
// pending adds a pulse so it visually reads as "in progress" not "done".
const toneStyles = {
  success: {
    background: BRAND_GRADIENT,
    iconClass: "text-white",
    pulse: false,
  },
  pending: { background: BRAND_GRADIENT, iconClass: "text-white", pulse: true },
  error: {
    background: "var(--error-container, #fde3e3)",
    iconClass: "text-error",
    pulse: false,
  },
};

/** Centered status hero used by verification screens. */
export default function StatusCard({
  tone = "success",
  icon,
  title,
  subtitle,
  list,
  listTitle,
  action,
  onAction,
  children,
}) {
  const t = toneStyles[tone] ?? toneStyles.success;

  return (
    <main className="min-h-screen bg-surface flex-1 px-margin-mobile pt-stack-lg pb-32 flex flex-col items-center text-center animate-fade-in relative overflow-hidden">
      {tone !== "error" && (
        <div
          className="absolute top-8 left-1/2 -translate-x-1/2 w-56 h-56 rounded-full opacity-20 blur-[70px] pointer-events-none"
          style={{ background: BRAND_GRADIENT }}
        />
      )}

      <div className="relative">
        {t.pulse && (
          <span
            className="absolute inset-0 rounded-full animate-ping opacity-40"
            style={{ background: t.background }}
          />
        )}
        <div
          className="relative w-24 h-24 rounded-full flex items-center justify-center mb-stack-lg"
          style={{ background: t.background }}
        >
          <Icon name={icon} fill className={`text-[56px] ${t.iconClass}`} />
        </div>
      </div>

      <h1 className="text-headline-lg-mobile font-headline-lg-mobile text-on-surface mb-2">
        {title}
      </h1>
      <p className="text-body-md text-on-surface-variant max-w-xs mb-stack-lg">
        {subtitle}
      </p>

      {list && (
        <Card className="w-full p-4 text-left">
          {listTitle && (
            <h3 className="text-label-lg font-label-lg text-on-surface mb-3">
              {listTitle}
            </h3>
          )}
          <ul className="space-y-3">
            {list.map((item, i) => (
              <li
                key={item}
                className="flex items-start gap-3 text-body-md text-on-surface-variant"
              >
                <span
                  className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5"
                  style={{ background: BRAND_GRADIENT }}
                >
                  <span className="text-white text-[11px] font-bold">
                    {i + 1}
                  </span>
                </span>
                {item}
              </li>
            ))}
          </ul>
        </Card>
      )}

      {children}

      {action && (
        <div className="fixed bottom-24 left-0 right-0 px-margin-mobile">
          <Button full onClick={onAction}>
            {action}
          </Button>
        </div>
      )}
    </main>
  );
}
