import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminGate from "./auth/AdminGate";
import CustomerShell from "./layout/CustomerShell";
import "./theme.css";

const Login = lazy(() => import("./screens/Login"));
const Home = lazy(() => import("./screens/Home"));
const CookMenu = lazy(() => import("./screens/CookMenu"));
const Cart = lazy(() => import("./screens/Cart"));
const Checkout = lazy(() => import("./screens/Checkout"));
const Orders = lazy(() => import("./screens/Orders"));
const OrderDetail = lazy(() => import("./screens/OrderDetail"));
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
            <Route path="cook/:id" element={<CookMenu />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="orders" element={<Orders />} />
            <Route path="orders/:id" element={<OrderDetail />} />
            {/* search, checkout, orders, orders/:id, profile */}
            {/* search, menu/:id, cart, checkout, orders, orders/:id, profile */}
          </Route>
          <Route path="*" element={<Navigate to="/customer" replace />} />
        </Routes>
      </Suspense>
    </div>
  );
}
