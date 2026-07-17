import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import TopAppBar from "../components/TopAppBar";
import TextField from "../components/TextField";
import Button from "../components/Button";

export default function Signup() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/otp", { state: { name, phone } });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopAppBar logo right={null} />
      <main className="w-full max-w-md mx-auto px-margin-mobile py-stack-lg flex-1 flex flex-col">
        <div className="relative w-full h-40 mb-stack-lg rounded-xl overflow-hidden bg-primary-fixed/40 flex items-center justify-center">
          <span className="material-symbols-outlined text-primary text-[64px]">
            storefront
          </span>
        </div>

        <div className="mb-stack-lg">
          <h2 className="text-headline-lg-mobile font-headline-lg-mobile text-on-surface mb-2">
            {t("signup.title")}
          </h2>
          <p className="text-body-md text-on-surface-variant">
            {t("signup.subtitle")}
          </p>
        </div>

        <form className="space-y-gutter" onSubmit={handleSubmit}>
          <TextField
            label={t("signup.fullName")}
            icon="person"
            id="name"
            placeholder={t("signup.fullNamePlaceholder")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <TextField
            label={t("signup.phoneNumber")}
            icon="call"
            prefix="+91"
            id="phone"
            type="tel"
            placeholder={t("signup.phoneNumberPlaceholder")}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <Button
            full
            icon="arrow_forward"
            type="submit"
            className="mt-stack-md"
          >
            {t("signup.getOtp")}
          </Button>
        </form>

        <p className="mt-stack-lg text-center text-body-md text-on-surface-variant">
          {t("signup.alreadyHaveAccount")}{" "}
          <Link to="/login" className="text-primary font-bold hover:underline">
            {t("signup.login")}
          </Link>
        </p>
      </main>
    </div>
  );
}
