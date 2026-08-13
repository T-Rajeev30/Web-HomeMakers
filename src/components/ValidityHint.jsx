import Icon from "./Icon";

/**
 * Live inline feedback under a field — e.g. "8/14 digits", or a
 * verified checkmark once a format is satisfied.
 *
 * state: "neutral" | "success" | "error"
 */
export default function ValidityHint({ state = "neutral", text }) {
  if (!text) return null;
  const styles = {
    neutral: { color: "var(--on-surface-variant, #6b5c45)", icon: "info" },
    success: { color: "#0fb59b", icon: "check_circle" },
    error: { color: "var(--error, #dc2626)", icon: "error" },
  }[state];

  return (
    <p
      className="mt-1.5 flex items-center gap-1 text-label-sm font-label-sm transition-colors"
      style={{ color: styles.color }}
    >
      <Icon name={styles.icon} className="text-[14px]" />
      {text}
    </p>
  );
}
