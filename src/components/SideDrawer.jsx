import { useNavigate } from "react-router-dom";
import Icon from "./Icon";

const navItems = [
  { icon: "payments", label: "Earnings" },
  { icon: "star", label: "Reviews", fill: true },
  { icon: "notifications", label: "Notifications" },
  { icon: "settings", label: "Settings" },
  { icon: "help_outline", label: "Help" },
];

export default function SideDrawer({ open, onClose }) {
  const navigate = useNavigate();
  return (
    <div className={`fixed inset-0 z-[100] ${open ? "" : "pointer-events-none"}`}>
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />
      <aside
        className={`absolute inset-y-0 left-0 flex flex-col py-4 bg-surface w-80 max-w-[85%] rounded-r-xl shadow-modal transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-6 py-6 border-b border-outline-variant">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-surface-container-highest flex items-center justify-center text-primary">
              <Icon name="person" className="text-[32px]" />
            </div>
            <div>
              <h2 className="text-headline-md font-headline-md text-on-surface">Sunita Sharma</h2>
              <p className="text-label-sm font-label-sm text-on-surface-variant">Kitchen ID: ZG1234</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto pt-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              className="w-full px-4 py-3 mx-2 flex items-center gap-4 rounded-full text-on-surface-variant font-medium hover:bg-surface-container-high transition-colors"
            >
              <Icon name={item.icon} fill={item.fill} /> {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 mt-auto">
          <button
            onClick={() => navigate("/login")}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-error font-bold rounded-xl active:bg-error-container transition-colors"
          >
            <Icon name="logout" /> Logout
          </button>
        </div>
      </aside>
    </div>
  );
}
