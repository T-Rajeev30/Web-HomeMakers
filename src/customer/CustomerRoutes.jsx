import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminGate from "./auth/AdminGate";
import CustomerShell from "./layout/CustomerShell";
import "./theme.css";

const Login = lazy(() => import("./screens/Login"));
const Home = lazy(() => import("./screens/Home"));

export default function CustomerRoutes() {
  return (
    <div className="zc-root" data-zc>
      <Suspense fallback={null}>
        <Routes>
          <Route path="login" element={<Login />} />
          <Route
            element={
              <AdminGate>
                <CustomerShell />
              </AdminGate>
            }
          >
            <Route index element={<Home />} />
            {/* search, menu/:id, cart, checkout, orders, orders/:id, profile */}
          </Route>
          <Route path="*" element={<Navigate to="/customer" replace />} />
        </Routes>
      </Suspense>
    </div>
  );
}
