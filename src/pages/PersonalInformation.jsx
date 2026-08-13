import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OnboardingLayout from "../components/OnboardingLayout";
import { Card } from "../components/Card";
import TextField from "../components/TextField";
import Button from "../components/Button";
import Icon from "../components/Icon";
import { saveStep } from "../store/useOnboarding";
import api from "../services/api";

const BRAND_GRADIENT =
  "linear-gradient(120deg, #FA8C0A 0%, #F05A64 45%, #E63C78 70%, #7832F0 100%)";

const genders = [
  { value: "female", label: "Female", icon: "female" },
  { value: "male", label: "Male", icon: "male" },
  { value: "other", label: "Other", icon: "transgender" },
];

export default function PersonalInformation() {
  const [gender, setGender] = useState("female");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await api.post("/api/onboarding/draft", {
        step: "personal",
        data: { name, email, gender },
      });
      saveStep("personal", { name, email, gender }); // local cache for progress UI
      navigate("/address-details");
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.details?.[0]?.message ||
          "Failed to save. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <OnboardingLayout step={1} stepLabel="Personal Information">
      <div className="relative">
        {/* ambient brand glow, echoes the loading/auth screens */}
        <div
          className="absolute -top-16 -right-10 w-56 h-56 rounded-full opacity-15 blur-[80px] pointer-events-none"
          style={{ background: BRAND_GRADIENT }}
        />

        <Card className="relative p-6 overflow-hidden">
          <div className="flex items-center gap-4 mb-stack-lg">
            <div
              className="shrink-0 w-14 h-14 rounded-full flex items-center justify-center"
              style={{ background: BRAND_GRADIENT }}
            >
              <Icon name="badge" className="text-white text-[26px]" />
            </div>
            <div>
              <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-1">
                Let's get to know you
              </h2>
              <p className="text-body-md text-on-surface-variant">
                Provide your details to personalize your ZINGRO experience.
              </p>
            </div>
          </div>

          <form className="space-y-stack-lg" onSubmit={submit}>
            <TextField
              label="Full Name"
              id="full-name"
              placeholder="e.g. Sunita Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <TextField
              label="Email Address"
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="space-y-stack-sm">
              <p className="text-label-lg font-label-lg text-on-surface-variant px-1">
                Gender
              </p>
              <div className="grid grid-cols-3 gap-2">
                {genders.map((g) => {
                  const active = gender === g.value;
                  return (
                    <button
                      type="button"
                      key={g.value}
                      onClick={() => setGender(g.value)}
                      className={`relative flex flex-col items-center justify-center gap-1 py-6 rounded-xl transition-all active:scale-95 ${
                        active
                          ? "text-white shadow-[0_8px_20px_rgba(230,60,120,0.28)]"
                          : "border border-outline-variant text-on-surface-variant hover:bg-surface-container"
                      }`}
                      style={
                        active ? { background: BRAND_GRADIENT } : undefined
                      }
                    >
                      <Icon name={g.icon} />
                      <span className="text-label-sm font-label-sm">
                        {g.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-error px-4 py-3 bg-error-container rounded-lg">
                <Icon name="error" className="text-base" />
                <span className="text-label-lg font-label-lg">{error}</span>
              </div>
            )}

            <Button full icon="arrow_forward" type="submit" disabled={saving}>
              {saving ? "Saving..." : "Continue"}
            </Button>
          </form>
        </Card>
      </div>
    </OnboardingLayout>
  );
}
