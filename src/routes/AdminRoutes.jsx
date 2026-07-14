import { Navigate, Outlet } from "react-router-dom";
import { useSession } from "../store/useSession";

export default function AdminRoute() {
  const { authed, user } = useSession();
  if (!authed) return <Navigate to="/login" replace />;
  if (user?.role !== "admin") return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}
