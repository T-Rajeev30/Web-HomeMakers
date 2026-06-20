import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OnboardingLayout from "../components/OnboardingLayout";
import { Card } from "../components/Card";
import TextField from "../components/TextField";
import Button from "../components/Button";
import Icon from "../components/Icon";

const genders = [
  { value: "female", label: "Female", icon: "female" },
  { value: "male", label: "Male", icon: "male" },
  { value: "other", label: "Other", icon: "transgender" },
];

export default function PersonalInformation() {
  const [gender, setGender] = useState("female");
  const navigate = useNavigate();
  return (
    <OnboardingLayout step={1} stepLabel="Personal Information">
      <Card className="p-6">
        <div className="mb-stack-lg">
          <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-2">
            Let's get to know you
          </h2>
          <p className="text-body-md text-on-surface-variant">
            Provide your details to personalize your ZINGRO experience.
          </p>
        </div>

        <form
          className="space-y-stack-lg"
          onSubmit={(e) => {
            e.preventDefault();
            navigate("/document-upload");
          }}
        >
          <TextField label="Full Name" id="full-name" placeholder="e.g. Sunita Sharma" required />
          <TextField label="Email Address (Optional)" id="email" type="email" placeholder="you@example.com" />

          <div className="space-y-stack-sm">
            <p className="text-label-lg font-label-lg text-on-surface-variant px-1">Gender</p>
            <div className="grid grid-cols-3 gap-2">
              {genders.map((g) => {
                const active = gender === g.value;
                return (
                  <button
                    type="button"
                    key={g.value}
                    onClick={() => setGender(g.value)}
                    className={`flex flex-col items-center justify-center gap-1 py-6 rounded-xl border transition-all ${
                      active
                        ? "bg-primary text-on-primary border-primary"
                        : "border-outline-variant text-on-surface-variant hover:bg-surface-container"
                    }`}
                  >
                    <Icon name={g.icon} />
                    <span className="text-label-sm font-label-sm">{g.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <Button full icon="arrow_forward" type="submit">
            Continue
          </Button>
        </form>
      </Card>
    </OnboardingLayout>
  );
}
