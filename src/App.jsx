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
import OrderDetail from "./pages/OrderDetail";
import Plans from "./pages/Plans";
import Profile from "./pages/Profile";
import AddressDetails from "./pages/AddressDetails";
import TaxDetails from "./pages/TaxDetails";
import BankDetails from "./pages/BankDetails";
import FssaiDetails from "./pages/FssaiDetails";
import AboutFood from "./pages/AboutFood";
import KitchenPhotos from "./pages/KitchenPhotos";
import KitchenInformation from "./pages/KitchenInformation";
import ReviewSubmit from "./pages/ReviewSubmit";

import VerificationSubmitted from "./pages/VerificationSubmitted";
import UnderReview from "./pages/UnderReview";
import VerificationApproved from "./pages/VerificationApproved";
import VerificationRejected from "./pages/VerificationRejected";
import DocumentReupload from "./pages/DocumentReupload";

import ManageCategories from "./pages/ManageCategories";
import AddDish from "./pages/AddDish";

import CreatePlan from "./pages/CreatePlan";

import ProtectedRoute from "./components/ProtectedRoute";

import Contact from "./pages/Contact";
import ContactPublic from "./pages/ContactPublic";

import Billing from "./pages/Billing";
import AdminCooksList from "./pages/AdminCooksList";
import AdminCookDetail from "./pages/AdminCooksDetail";

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
      <Route element={<ProtectedRoute />}>
        {/* App screens — full layout with bottom navigation */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/orders/:id" element={<OrderDetail />} />
          <Route path="/billing" element={<Billing />} />
        </Route>

        {/* Onboarding & verification — no bottom navigation */}
        <Route path="/address-details" element={<AddressDetails />} />
        <Route path="/tax-details" element={<TaxDetails />} />
        <Route path="/bank-details" element={<BankDetails />} />
        <Route path="/fssai-details" element={<FssaiDetails />} />
        <Route path="/about-food" element={<AboutFood />} />
        <Route path="/kitchen-photos" element={<KitchenPhotos />} />
        <Route path="/kitchen-information" element={<KitchenInformation />} />
        <Route path="/review-submit" element={<ReviewSubmit />} />
        <Route
          path="/verification-submitted"
          element={<VerificationSubmitted />}
        />
        <Route path="/under-review" element={<UnderReview />} />
        <Route
          path="/verification-approved"
          element={<VerificationApproved />}
        />
        <Route
          path="/verification-rejected"
          element={<VerificationRejected />}
        />
        <Route path="/document-reupload" element={<DocumentReupload />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
      <Route path="/menu/add" element={<AddDish />} />
      <Route path="/menu/categories" element={<ManageCategories />} />
      <Route path="/contact" element={<ContactPublic />} />
      <Route path="/support" element={<Contact />} />
      <Route path="/plans/new" element={<CreatePlan />} />
      <Route element={<AdminRoute />}>
        <Route path="/admin/cooks" element={<AdminCooksList />} />
        <Route path="/admin/cooks/:id" element={<AdminCookDetail />} />
      </Route>
    </Routes>
  );
}
