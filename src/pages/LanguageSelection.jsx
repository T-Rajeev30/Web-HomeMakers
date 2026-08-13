import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import TopAppBar from "../components/TopAppBar";
import Button from "../components/Button";
import { languages } from "../data/mock";

const BRAND_GRADIENT =
  "linear-gradient(120deg, #FA8C0A 0%, #F05A64 45%, #E63C78 70%, #7832F0 100%)";

export default function LanguageSelection() {
  const { i18n, t } = useTranslation();
  const [selected, setSelected] = useState(i18n.language || "hi");
  const navigate = useNavigate();

  const confirm = () => {
    i18n.changeLanguage(selected);
    navigate("/signup");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      {/* soft brand glow, consistent with LoadingScreen/Landing */}
      <div
        className="absolute -top-24 -right-24 w-72 h-72 rounded-full opacity-20 blur-[90px] pointer-events-none"
        style={{ background: BRAND_GRADIENT }}
      />

      <TopAppBar />

      <main className="relative flex-grow w-full max-w-lg mx-auto px-margin-mobile py-stack-lg flex flex-col">
        <div className="mb-stack-lg">
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-1">
            {t("languageSelection.title")}
          </h1>
          <p
            className="font-headline-md text-headline-md font-semibold bg-clip-text text-transparent"
            style={{ backgroundImage: BRAND_GRADIENT }}
          >
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
                className={`relative flex flex-col items-center justify-center p-stack-lg rounded-xl text-center transition-all active:scale-95 ${
                  active
                    ? "bg-surface-container-lowest shadow-[0_8px_24px_rgba(230,60,120,0.18)]"
                    : "border border-outline-variant bg-surface-container-lowest hover:border-primary"
                }`}
                style={
                  active
                    ? {
                        border: "2px solid transparent",
                        backgroundImage: `linear-gradient(var(--surface-container-lowest, #fff), var(--surface-container-lowest, #fff)), ${BRAND_GRADIENT}`,
                        backgroundOrigin: "border-box",
                        backgroundClip: "padding-box, border-box",
                      }
                    : undefined
                }
              >
                <span
                  className={`text-headline-lg font-headline-lg mb-2 ${!active ? "text-on-surface" : ""}`}
                  style={
                    active
                      ? {
                          backgroundImage: BRAND_GRADIENT,
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }
                      : undefined
                  }
                >
                  {lang.glyph}
                </span>
                <span className="font-label-lg text-label-lg text-on-surface">
                  {lang.name}
                </span>
                {active && (
                  <span
                    className="absolute top-2 right-2 w-2 h-2 rounded-full"
                    style={{ background: BRAND_GRADIENT }}
                  />
                )}
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
