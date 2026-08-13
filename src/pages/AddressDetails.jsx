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
import { BRAND_GRADIENT } from "../lib/brand";

export default function AddressDetails() {
  const navigate = useNavigate();
  const s = STEPS.address;
  const [pincode, setPincode] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const pincodeState =
    pincode.length === 0
      ? "neutral"
      : pincode.length === 6
        ? "success"
        : "error";
  const pincodeHint =
    pincode.length === 0
      ? "6-digit postal code"
      : pincode.length === 6
        ? "Looks good"
        : `${pincode.length}/6 digits`;

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    const f = e.target;
    const data = {
      building: f.building.value,
      locality: f.locality.value,
      pincode: f.pincode.value,
    };
    try {
      await api.post("/api/onboarding/draft", { step: "address", data });
      saveStep("address", data);
      navigate(s.next);
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
    <OnboardingLayout step={s.step} stepLabel={s.label}>
      <Card className="p-6">
        <div className="flex items-center gap-4 mb-stack-lg">
          <div
            className="shrink-0 w-14 h-14 rounded-full flex items-center justify-center"
            style={{ background: BRAND_GRADIENT }}
          >
            <Icon name="location_on" className="text-white text-[26px]" />
          </div>
          <div>
            <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-1">
              Where is your kitchen located?
            </h2>
            <p className="text-body-md text-on-surface-variant">
              We use this to show your food to nearby customers.
            </p>
          </div>
        </div>

        <form className="space-y-stack-lg" onSubmit={submit}>
          <TextField
            label="House / Flat / Building"
            id="building"
            placeholder="e.g. B-204 Lotus PG"
            required
          />
          <TextField
            label="Locality / Area"
            id="locality"
            placeholder="e.g. Bandra West"
            required
          />
          <div>
            <TextField
              label="Pincode"
              id="pincode"
              inputMode="numeric"
              maxLength={6}
              placeholder="e.g. 400050"
              value={pincode}
              onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
              required
            />
            <ValidityHint state={pincodeState} text={pincodeHint} />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-error px-4 py-3 bg-error-container rounded-lg">
              <Icon name="error" className="text-base" />
              <span className="text-label-lg font-label-lg">{error}</span>
            </div>
          )}

          <Button
            full
            icon="arrow_forward"
            type="submit"
            disabled={saving || pincode.length !== 6}
          >
            {saving ? "Saving..." : "Continue"}
          </Button>
        </form>
      </Card>
    </OnboardingLayout>
  );
}
