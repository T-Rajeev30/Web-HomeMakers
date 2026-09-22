import { NavLink, Outlet } from "react-router-dom";
import { getUser, clearSession } from "../auth/session";

const tabs = [
  { to: "/customer", label: "Home", icon: "home", end: true },
  { to: "/customer/search", label: "Search", icon: "search" },
  { to: "/customer/orders", label: "Orders", icon: "receipt_long" },
  { to: "/customer/cart", label: "Cart", icon: "shopping_bag" },
];

export default function CustomerShell() {
  const user = getUser();

  return (
    <div className="zc-shell">
      <header className="zc-topbar">
        <span className="zc-brand">zingro</span>
        <div className="zc-topbar-right">
          {user?.phone && <span className="zc-dim">{user.phone}</span>}
          <button
            className="zc-icon-btn"
            onClick={() => {
              clearSession();
              window.location.replace("/customer/login");
            }}
            aria-label="Sign out"
          >
            <span className="material-symbols-rounded">logout</span>
          </button>
        </div>
      </header>

      <main className="zc-content">
        <Outlet />
      </main>

      <nav className="zc-tabbar">
        {tabs.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            end={t.end}
            className={({ isActive }) =>
              `zc-tab${isActive ? " zc-tab-active" : ""}`
            }
          >
            <span className="material-symbols-rounded">{t.icon}</span>
            <span>{t.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
