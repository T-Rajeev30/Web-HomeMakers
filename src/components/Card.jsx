export function Card({ children, className = "", ...props }) {
  return (
    <div
      className={`bg-surface-container-lowest border border-outline-variant rounded-xl shadow-card ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

const chipTones = {
  pending: "bg-tertiary-container text-on-tertiary-container",
  active: "bg-secondary-container text-on-secondary-container",
  success: "bg-primary-fixed text-on-primary-fixed",
  neutral: "bg-surface-container-high text-on-surface-variant",
};

export function Chip({ tone = "neutral", children }) {
  return (
    <span
      className={`px-3 py-1 rounded-full text-label-sm font-label-sm uppercase tracking-wider ${chipTones[tone]}`}
    >
      {children}
    </span>
  );
}

export function ProgressBar({ value = 0 }) {
  return (
    <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
      <div
        className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
