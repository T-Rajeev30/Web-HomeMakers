import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OnboardingLayout from "../components/OnboardingLayout";
import { Card } from "../components/Card";
import TextField from "../components/TextField";
import Button from "../components/Button";
import Icon from "../components/Icon";
import ValidityHint from "../components/ValidityHint";
import { STEPS } from "../data/onboarding";
import { saveStep } from "../store/useOnboarding";
import api from "../services/api";
import { showToast } from "../store/useToast";
import { BRAND_GRADIENT } from "../lib/brand";

const IFSC_RE = /^[A-Z]{4}0[A-Z0-9]{6}$/;

export default function BankDetails() {
  const navigate = useNavigate();
  const s = STEPS.bank;
  const [form, setForm] = useState({ holder: "", account: "", ifsc: "" });
  const [confirmAccount, setConfirmAccount] = useState("");
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) =>
    setForm({
      ...form,
      [k]: k === "ifsc" ? e.target.value.toUpperCase() : e.target.value,
    });

  const ifscValid = IFSC_RE.test(form.ifsc);
  const ifscState =
    form.ifsc.length === 0 ? "neutral" : ifscValid ? "success" : "error";
  const ifscHint =
    form.ifsc.length === 0
      ? "Format: HDFC0001234"
      : ifscValid
        ? "Valid IFSC format"
        : `${form.ifsc.length}/11 characters`;

  const accountsMatch =
    confirmAccount.length > 0 && confirmAccount === form.account;
  const confirmState =
    confirmAccount.length === 0
      ? "neutral"
      : accountsMatch
        ? "success"
        : "error";
  const confirmHint =
    confirmAccount.length === 0
      ? "Re-enter to confirm — avoids payout errors"
      : accountsMatch
        ? "Account numbers match"
        : "Doesn't match the account number above";

  const submit = async (e) => {
    e.preventDefault();
    if (form.account.length < 8) return setErr("Enter a valid account number.");
    if (!IFSC_RE.test(form.ifsc))
      return setErr("Enter a valid IFSC (e.g. HDFC0001234).");
    if (form.account !== confirmAccount)
      return setErr("Account numbers don't match. Please re-check.");

    setErr("");
    setSaving(true);
    try {
      const res = await api.post("/api/onboarding/draft", {
        step: "bank",
        data: form,
      });
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
        <div className="flex items-center gap-4 mb-stack-lg">
          <div
            className="shrink-0 w-14 h-14 rounded-full flex items-center justify-center"
            style={{ background: BRAND_GRADIENT }}
          >
            <Icon name="account_balance" className="text-white text-[26px]" />
          </div>
          <div>
            <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-1">
              Bank account details
            </h2>
            <p className="text-body-md text-on-surface-variant">
              Used for payouts. We verify via a ₹1 penny-drop at submission.
            </p>
          </div>
        </div>

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
          <div>
            <TextField
              label="Confirm Account Number"
              id="confirm-account"
              inputMode="numeric"
              placeholder="Re-enter account number"
              value={confirmAccount}
              onChange={(e) => setConfirmAccount(e.target.value)}
              required
            />
            <ValidityHint state={confirmState} text={confirmHint} />
          </div>
          <div>
            <TextField
              label="IFSC Code"
              id="ifsc"
              placeholder="HDFC0001234"
              value={form.ifsc}
              maxLength={11}
              onChange={set("ifsc")}
              required
            />
            <ValidityHint state={ifscState} text={ifscHint} />
          </div>

          {err && (
            <div className="flex items-center gap-2 text-error px-4 py-3 bg-error-container rounded-lg">
              <Icon name="error" className="text-base" />
              <span className="text-label-lg font-label-lg">{err}</span>
            </div>
          )}

          <Button
            full
            icon="arrow_forward"
            type="submit"
            disabled={saving || !accountsMatch}
          >
            {saving ? "Saving..." : "Continue"}
          </Button>
        </form>
      </Card>
    </OnboardingLayout>
  );
}
