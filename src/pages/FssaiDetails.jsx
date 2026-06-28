import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OnboardingLayout from "../components/OnboardingLayout";
import { Card } from "../components/Card";
import TextField from "../components/TextField";
import Button from "../components/Button";
import { STEPS } from "../data/onboarding";
import { saveStep } from "../store/useOnboarding";

export default function FssaiDetails() {
  const navigate = useNavigate();
  const s = STEPS.fssai;
  const [license, setLicense] = useState("");
  const [err, setErr] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!/^[0-9]{14}$/.test(license))
      return setErr("FSSAI license must be 14 digits.");
    saveStep("fssai", { license });
    navigate(s.next);
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
            <p className="text-label-sm font-label-sm text-error">{err}</p>
          )}
          <Button full icon="arrow_forward" type="submit">
            Continue
          </Button>
        </form>
      </Card>
    </OnboardingLayout>
  );
}
