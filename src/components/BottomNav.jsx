import { NavLink } from "react-router-dom";
import Icon from "./Icon";

const items = [
  { to: "/dashboard", icon: "dashboard", label: "Dashboard" },
  { to: "/orders", icon: "receipt_long", label: "Orders" },
  { to: "/menu", icon: "restaurant_menu", label: "Menu" },
  { to: "/plans", icon: "subscriptions", label: "Plans" },
  { to: "/profile", icon: "person", label: "Profile" },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-2 bg-surface border-t border-outline-variant">
      {items.map(({ to, icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-0.5 rounded-xl px-3 py-1 transition-all active:scale-95 ${
              isActive
                ? "bg-primary text-on-primary"
                : "text-on-surface-variant hover:bg-surface-container-highest"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Icon name={icon} fill={isActive} />
              <span className="text-label-sm font-label-sm">{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
