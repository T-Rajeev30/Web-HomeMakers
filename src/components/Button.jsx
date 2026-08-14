import Icon from "./Icon";
import { BRAND_GRADIENT } from "../lib/brand";

const variants = {
  primary:
    "text-on-primary shadow-card hover:shadow-modal hover:brightness-105",
  outline:
    "bg-surface-container-lowest text-on-surface border border-outline-variant hover:bg-surface-container-low hover:border-outline",
  tonal:
    "bg-surface-container-highest text-primary border border-outline-variant",
  text: "text-primary hover:bg-surface-container-high",
};

export default function Button({
  children,
  variant = "primary",
  icon,
  iconRight = true,
  full = false,
  className = "",
  disabled = false,
  style,
  ...props
}) {
  return (
    <button
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 h-touch-target-min px-6 rounded-lg
        font-label-lg text-label-lg transition-all duration-150
        ${disabled ? "opacity-50 cursor-not-allowed" : "active:scale-[0.97]"}
        ${variants[variant]} ${full ? "w-full" : ""} ${className}`}
      style={
        variant === "primary" ? { background: BRAND_GRADIENT, ...style } : style
      }
      {...props}
    >
      {icon && !iconRight && <Icon name={icon} />}
      {children}
      {icon && iconRight && <Icon name={icon} />}
    </button>
  );
}
