import Icon from "./Icon";

export default function TextField({
  label,
  icon,
  prefix,
  id,
  className = "",
  ...props
}) {
  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={id}
          className="block mb-2 text-label-lg font-label-lg text-on-surface-variant"
        >
          {label}
        </label>
      )}
      <div className="flex items-center h-touch-target-min px-4 rounded-lg bg-surface-container-lowest border border-outline-variant focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
        {icon && <Icon name={icon} className="text-outline mr-3 text-[20px]" />}
        {prefix && (
          <span className="text-body-md text-on-surface mr-2 border-r border-outline-variant pr-2">
            {prefix}
          </span>
        )}
        <input
          id={id}
          className="flex-1 bg-transparent outline-none text-body-md text-on-surface placeholder:text-outline/60"
          {...props}
        />
      </div>
    </div>
  );
}
