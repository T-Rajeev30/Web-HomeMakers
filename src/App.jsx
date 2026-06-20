import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import LanguageSelection from "./pages/LanguageSelection";
import Signup from "./pages/Signup";
import OtpVerification from "./pages/OtpVerification";
import Login from "./pages/Login";
import PersonalInformation from "./pages/PersonalInformation";
import DocumentUpload from "./pages/DocumentUpload";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Menu from "./pages/Menu";
import Placeholder from "./pages/Placeholder";

export default function App() {
  return (
    <Routes>
      {/* Auth & onboarding (no bottom nav) */}
      <Route path="/" element={<LanguageSelection />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/otp" element={<OtpVerification />} />
      <Route path="/login" element={<Login />} />
      <Route path="/personal-information" element={<PersonalInformation />} />
      <Route path="/document-upload" element={<DocumentUpload />} />

      {/* App shell (with bottom nav + drawer) */}
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/plans" element={<Placeholder title="Subscription Plans" icon="subscriptions" />} />
        <Route path="/profile" element={<Placeholder title="Your Profile" icon="person" />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
