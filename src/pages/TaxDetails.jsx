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

const PAN_RE = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
const GST_RE = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][0-9A-Z]{3}$/;

export default function TaxDetails() {
  const navigate = useNavigate();
  const s = STEPS.tax;
  const [pan, setPan] = useState("");
  const [gst, setGst] = useState("");
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!PAN_RE.test(pan))
      return setErr("Enter a valid PAN (e.g. ABCDE1234F).");
    if (gst && !GST_RE.test(gst))
      return setErr("GST number format is invalid.");

    setErr("");
    setSaving(true);
    try {
      await api.post("/api/onboarding/draft", {
        step: "tax",
        data: { pan, gst },
      });
      saveStep("tax", { pan, gst });
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
          Tax details
        </h2>
        <p className="text-body-md text-on-surface-variant mb-stack-lg">
          We verify your PAN during final submission. GST is optional.
        </p>
        <form className="space-y-stack-lg" onSubmit={submit}>
          <TextField
            label="PAN Number"
            id="pan"
            placeholder="ABCDE1234F"
            value={pan}
            maxLength={10}
            onChange={(e) => setPan(e.target.value.toUpperCase())}
            required
          />
          <TextField
            label="GST Number (Optional)"
            id="gst"
            placeholder="22ABCDE1234F1Z5"
            value={gst}
            maxLength={15}
            onChange={(e) => setGst(e.target.value.toUpperCase())}
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
