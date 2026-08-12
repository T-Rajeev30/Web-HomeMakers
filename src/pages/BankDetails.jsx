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

const IFSC_RE = /^[A-Z]{4}0[A-Z0-9]{6}$/;

export default function BankDetails() {
  const navigate = useNavigate();
  const s = STEPS.bank;
  const [form, setForm] = useState({ holder: "", account: "", ifsc: "" });
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) =>
    setForm({
      ...form,
      [k]: k === "ifsc" ? e.target.value.toUpperCase() : e.target.value,
    });

  const submit = async (e) => {
    e.preventDefault();
    if (form.account.length < 8) return setErr("Enter a valid account number.");
    if (!IFSC_RE.test(form.ifsc))
      return setErr("Enter a valid IFSC (e.g. HDFC0001234).");

    setErr("");
    setSaving(true);
    try {
      const res = await api.post("/api/onboarding/draft", { step: "bank", data: form });
if (res.data.verification) {
  showToast(
    res.data.verification.verified ? "success" : "error",
    res.data.verification.verified
      ? "Bank account verified successfully"
      : "Bank account could not be verified — will need manual review",
  );
}
      saveStep("bank", form);
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
          Bank account details
        </h2>
        <p className="text-body-md text-on-surface-variant mb-stack-lg">
          Used for payouts. We verify via a â‚¹1 penny-drop at submission.
        </p>
        <form className="space-y-stack-lg" onSubmit={submit}>
          <TextField
            label="Account Holder Name"
            id="holder"
            placeholder="e.g. Sunita Sharma"
            value={form.holder}
            onChange={set("holder")}
            required
          />
          <TextField
            label="Account Number"
            id="account"
            inputMode="numeric"
            placeholder="Enter account number"
            value={form.account}
            onChange={set("account")}
            required
          />
          <TextField
            label="IFSC Code"
            id="ifsc"
            placeholder="HDFC0001234"
            value={form.ifsc}
            maxLength={11}
            onChange={set("ifsc")}
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
