import Icon from "./Icon";

const variants = {
  primary: "bg-primary text-on-primary shadow-card hover:opacity-95",
  outline:
    "bg-surface-container-lowest text-on-surface border border-outline-variant hover:bg-surface-container-low",
  tonal: "bg-surface-container-highest text-primary border border-outline-variant",
  text: "text-primary hover:bg-surface-container-high",
};

export default function Button({
  children,
  variant = "primary",
  icon,
  iconRight = true,
  full = false,
  className = "",
  ...props
}) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 h-touch-target-min px-6 rounded-lg
        font-label-lg text-label-lg active:scale-[0.98] transition-all
        ${variants[variant]} ${full ? "w-full" : ""} ${className}`}
      {...props}
    >
      {icon && !iconRight && <Icon name={icon} />}
      {children}
      {icon && iconRight && <Icon name={icon} />}
    </button>
  );
}
