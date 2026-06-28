import { useNavigate } from "react-router-dom";
import OnboardingLayout from "../components/OnboardingLayout";
import { Card } from "../components/Card";
import TextField from "../components/TextField";
import Button from "../components/Button";
import { STEPS } from "../data/onboarding";
import { saveStep } from "../store/useOnboarding";

export default function AddressDetails() {
  const navigate = useNavigate();
  const s = STEPS.address;
  return (
    <OnboardingLayout step={s.step} stepLabel={s.label}>
      <Card className="p-6">
        <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-stack-lg">
          Where is your kitchen located?
        </h2>
        <form
          className="space-y-stack-lg"
          onSubmit={(e) => {
            e.preventDefault();
            const f = e.target;
            saveStep("address", {
              building: f.building.value,
              locality: f.locality.value,
              pincode: f.pincode.value,
            });
            navigate(s.next);
          }}
        >
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
          <TextField
            label="Pincode"
            id="pincode"
            inputMode="numeric"
            maxLength={6}
            placeholder="e.g. 400050"
            required
          />
          <Button full icon="arrow_forward" type="submit">
            Continue
          </Button>
        </form>
      </Card>
    </OnboardingLayout>
  );
}
