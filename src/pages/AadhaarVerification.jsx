import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OnboardingLayout from "../components/OnboardingLayout";
import { Card } from "../components/Card";
import Button from "../components/Button";
import Icon from "../components/Icon";
import api from "../services/api";
import { STEPS } from "../data/onboarding";
import { showToast } from "../store/useToast";
import { BRAND_GRADIENT } from "../lib/brand";

const HOW_IT_WORKS = [
  { icon: "login", text: "Log into DigiLocker with your Aadhaar" },
  { icon: "photo_camera", text: "Take a quick selfie to confirm it's you" },
  { icon: "task_alt", text: "We verify instantly and you're done" },
];

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
        <div
          className="w-16 h-16 mx-auto mb-stack-md rounded-full flex items-center justify-center transition-transform"
          style={{
            background:
              status === "done"
                ? "#0fb59b"
                : status === "error"
                  ? "var(--error-container, #fde3e3)"
                  : BRAND_GRADIENT,
          }}
        >
          <Icon
            name={
              status === "done"
                ? "check"
                : status === "error"
                  ? "error"
                  : "badge"
            }
            className={`text-[32px] ${
              status === "error" ? "text-error" : "text-white"
            }`}
          />
        </div>

        <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-2">
          {status === "done" ? "Aadhaar verified" : "Verify your Aadhaar"}
        </h2>
        <p className="text-body-md text-on-surface-variant mb-stack-lg">
          {status === "done"
            ? "Your identity has been confirmed. You're ready for the next step."
            : "You'll be asked to log into DigiLocker and take a quick selfie to confirm your identity."}
        </p>

        {status !== "done" && (
          <div className="flex flex-col gap-3 mb-stack-lg text-left">
            {HOW_IT_WORKS.map((step, i) => (
              <div
                key={step.text}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-container-lowest"
              >
                <span
                  className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-label-sm font-label-sm"
                  style={{ background: BRAND_GRADIENT }}
                >
                  {i + 1}
                </span>
                <Icon
                  name={step.icon}
                  className="text-on-surface-variant text-[20px]"
                />
                <span className="text-body-md text-on-surface">
                  {step.text}
                </span>
              </div>
            ))}
          </div>
        )}

        {status === "in_progress" && (
          <div className="flex items-center justify-center gap-2 mb-stack-md text-on-surface-variant">
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: BRAND_GRADIENT }}
            />
            <span className="text-label-lg font-label-lg">
              Waiting for verification to complete…
            </span>
          </div>
        )}

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
              : status === "error"
                ? "Try Again"
                : "Start Aadhaar Verification"}
          </Button>
        )}
      </Card>
    </OnboardingLayout>
  );
}
