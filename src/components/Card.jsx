export function Card({ children, className = "", onClick, ...props }) {
  return (
    <div
      onClick={onClick}
      className={`bg-surface-container-lowest border border-outline-variant/60 rounded-xl shadow-card transition-all duration-200 ${
        onClick
          ? "cursor-pointer hover:shadow-modal hover:border-outline-variant active:scale-[0.99]"
          : ""
      } ${className}`}
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
      className={`inline-flex items-center px-3 py-1 rounded-full text-label-sm font-label-sm uppercase tracking-wider whitespace-nowrap ${chipTones[tone]}`}
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
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
