import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OnboardingLayout from "../components/OnboardingLayout";
import { Card } from "../components/Card";
import Button from "../components/Button";
import Icon from "../components/Icon";
import api from "../services/api";
import { STEPS } from "../data/onboarding";
import { showToast } from "../store/useToast";

export default function AadhaarVerification() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("idle"); // idle | starting | in_progress | done | error
  const [err, setErr] = useState("");

  const startVerification = async () => {
    setStatus("starting");
    setErr("");
    try {
      const { data } = await api.post("/api/onboarding/aadhaar/create-request");

      const digio = new window.Digio({
        environment: "production",
        is_iframe: false,
        logo: "https://zingro.in/logo.png",
        theme: { primaryColor: "#ff6b00", secondaryColor: "#7832f0" },
        callback: async (response) => {
          if (response?.error_code) {
            setStatus("error");
            setErr(response.message || "Aadhaar verification failed.");
            showToast("error", "Aadhaar verification failed.");
          } else {
            try {
              await api.post("/api/onboarding/aadhaar/confirm");
            } catch (e) {
              // non-fatal — webhook will eventually reconcile this if it's registered
            }
            setStatus("done");
            showToast("success", "Aadhaar verified successfully");
          }
        },
      });

      digio.init();
      digio.submit(data.kycId, data.customerIdentifier);
      setStatus("in_progress");
    } catch (error) {
      setStatus("error");
      setErr(
        error.response?.data?.error || "Failed to start Aadhaar verification.",
      );
    }
  };

  return (
    <OnboardingLayout
      step={STEPS.aadhaar.step}
      stepLabel="Aadhaar Verification"
    >
      <Card className="p-6 text-center">
        <div className="w-16 h-16 mx-auto mb-stack-md rounded-full bg-primary-fixed flex items-center justify-center">
          <Icon name="badge" className="text-primary text-[32px]" />
        </div>
        <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-2">
          Verify your Aadhaar
        </h2>
        <p className="text-body-md text-on-surface-variant mb-stack-lg">
          You'll be asked to log into DigiLocker and take a quick selfie to
          confirm your identity.
        </p>

        {err && (
          <div className="flex items-center gap-2 text-error px-4 py-3 bg-error-container rounded-lg mb-stack-md text-left">
            <Icon name="error" className="text-base" />
            <span className="text-label-lg font-label-lg">{err}</span>
          </div>
        )}

        {status === "done" ? (
          <Button
            full
            icon="arrow_forward"
            onClick={() => navigate(STEPS.aadhaar.next)}
          >
            Continue
          </Button>
        ) : (
          <Button
            full
            icon="verified_user"
            onClick={startVerification}
            disabled={status === "starting" || status === "in_progress"}
          >
            {status === "starting"
              ? "Starting..."
              : "Start Aadhaar Verification"}
          </Button>
        )}
      </Card>
    </OnboardingLayout>
  );
}
