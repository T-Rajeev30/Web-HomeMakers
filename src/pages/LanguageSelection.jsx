import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import TopAppBar from "../components/TopAppBar";
import Button from "../components/Button";
import { languages } from "../data/mock";

export default function LanguageSelection() {
  const { i18n, t } = useTranslation();
  const [selected, setSelected] = useState(i18n.language || "hi");
  const navigate = useNavigate();

  const confirm = () => {
    i18n.changeLanguage(selected);
    navigate("/signup");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopAppBar />
      <main className="flex-grow w-full max-w-lg mx-auto px-margin-mobile py-stack-lg flex flex-col">
        <div className="mb-stack-lg">
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-1">
            {t("languageSelection.title")}
          </h1>
          <p className="font-headline-md text-headline-md text-primary opacity-90">
            {t("languageSelection.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-stack-lg flex-grow">
          {languages.map((lang) => {
            const active = selected === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => setSelected(lang.code)}
                className={`flex flex-col items-center justify-center p-stack-lg rounded-xl border text-center transition-all active:scale-95 ${
                  active
                    ? "border-primary bg-primary-fixed/40 ring-1 ring-primary"
                    : "border-outline-variant bg-surface-container-lowest hover:border-primary"
                }`}
              >
                <span
                  className={`text-headline-lg font-headline-lg mb-2 ${active ? "text-primary" : ""}`}
                >
                  {lang.glyph}
                </span>
                <span className="font-label-lg text-label-lg text-on-surface">
                  {lang.name}
                </span>
              </button>
            );
          })}
        </div>

        <Button full icon="arrow_forward" onClick={confirm}>
          {t("common.continue")}
        </Button>
      </main>
    </div>
  );
}
