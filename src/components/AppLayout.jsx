import { useState } from "react";
import { Outlet } from "react-router-dom";
import BottomNav from "./BottomNav";
import SideDrawer from "./SideDrawer";
import TopAppBar from "./TopAppBar";

/** Layout for authenticated app screens (dashboard, orders, menu...). */
export default function AppLayout({ showMenu = true }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  return (
    <div className="min-h-screen bg-surface pb-24">
      <TopAppBar logo showMenu={showMenu} onMenu={() => setDrawerOpen(true)} />
      <Outlet />
      <BottomNav />
      <SideDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}
