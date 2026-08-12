import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OnboardingLayout from "../components/OnboardingLayout";
import { Card } from "../components/Card";
import TextField from "../components/TextField";
import Button from "../components/Button";
import Icon from "../components/Icon";
import { STEPS } from "../data/onboarding";
import { saveStep } from "../store/useOnboarding";
import api from "../services/api";
import { showToast } from "../store/useToast";

export default function FssaiDetails() {
  const navigate = useNavigate();
  const s = STEPS.fssai;
  const [license, setLicense] = useState("");
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!/^[0-9]{14}$/.test(license))
      return setErr("FSSAI license must be 14 digits.");

    setErr("");
    setSaving(true);
    try {
      const res = await api.post("/api/onboarding/draft", {
        step: "fssai",
        data: { license },
      });
if (res.data.verification) {
  showToast(
    res.data.verification.verified ? "success" : "error",
    res.data.verification.verified
      ? "FSSAI license verified successfully"
      : "FSSAI license could not be verified — will need manual review",
  );
}
      saveStep("fssai", { license });
      navigate(s.next);
    } catch (error) {
      setErr(
        error.response?.data?.error ||
          error.response?.data?.details?.[0]?.message ||
          "Failed to save. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <OnboardingLayout step={s.step} stepLabel={s.label}>
      <Card className="p-6">
        <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-2">
          FSSAI license
        </h2>
        <p className="text-body-md text-on-surface-variant mb-stack-lg">
          Enter your 14-digit FSSAI registration or license number. We validate
          it at submission.
        </p>
        <form className="space-y-stack-lg" onSubmit={submit}>
          <TextField
            label="FSSAI License Number"
            id="fssai"
            inputMode="numeric"
            placeholder="12345678901234"
            value={license}
            maxLength={14}
            onChange={(e) => setLicense(e.target.value.replace(/\D/g, ""))}
            required
          />
          {err && (
            <div className="flex items-center gap-2 text-error px-4 py-3 bg-error-container rounded-lg">
              <Icon name="error" className="text-base" />
              <span className="text-label-lg font-label-lg">{err}</span>
            </div>
          )}
          <Button full icon="arrow_forward" type="submit" disabled={saving}>
            {saving ? "Saving..." : "Continue"}
          </Button>
        </form>
      </Card>
    </OnboardingLayout>
  );
}
