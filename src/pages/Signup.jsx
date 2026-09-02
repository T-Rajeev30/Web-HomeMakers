import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import TopAppBar from "../components/TopAppBar";
import TextField from "../components/TextField";
import Button from "../components/Button";

const BRAND_GRADIENT =
  "linear-gradient(120deg, #FA8C0A 0%, #F05A64 45%, #E63C78 70%, #7832F0 100%)";

export default function Signup() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const digits = phone.replace(/\D/g, "");
    if (digits.length !== 10) {
      return; // TODO: surface inline error via TextField error state
    }
    navigate("/otp", { state: { name, phone: digits } });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      <div
        className="absolute -top-20 -left-20 w-64 h-64 rounded-full opacity-20 blur-[90px] pointer-events-none"
        style={{ background: BRAND_GRADIENT }}
      />

      <TopAppBar logo right={null} />
      <main className="relative w-full max-w-md mx-auto px-margin-mobile py-stack-lg flex-1 flex flex-col">
        <div className="relative w-full h-40 mb-stack-lg rounded-xl overflow-hidden flex items-center justify-center">
          <div
            className="absolute inset-0 opacity-15"
            style={{ background: BRAND_GRADIENT }}
          />
          <div
            className="relative w-20 h-20 rounded-full flex items-center justify-center"
            style={{ background: BRAND_GRADIENT }}
          >
            <span className="material-symbols-outlined text-white text-[36px]">
              storefront
            </span>
          </div>
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
          <Link
            to="/login"
            className="font-bold hover:underline bg-clip-text text-transparent"
            style={{ backgroundImage: BRAND_GRADIENT }}
          >
            {t("signup.login")}
          </Link>
        </p>
      </main>
    </div>
  );
}
