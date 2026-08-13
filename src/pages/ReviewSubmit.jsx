import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OnboardingLayout from "../components/OnboardingLayout";
import { Card } from "../components/Card";
import Button from "../components/Button";
import Icon from "../components/Icon";
import { STEPS } from "../data/onboarding";
import { setVerification } from "../store/useSession";
import { useOnboarding } from "../store/useOnboarding";
import LegalModal, {
  TermsContent,
  PrivacyContent,
} from "../components/LegalModal";
import api from "../services/api";
import { BRAND_GRADIENT } from "../lib/brand";

export default function ReviewSubmit() {
  const navigate = useNavigate();
  const s = STEPS.review;
  const d = useOnboarding();
  const [terms, setTerms] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const [legal, setLegal] = useState(null); // "terms" | "privacy" | null
  const [err, setErr] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const sections = [
    {
      icon: "person",
      title: "Personal Information",
      sub: d.personal?.name || "—",
      to: "/personal-information",
    },
    {
      icon: "location_on",
      title: "Address",
      sub:
        [d.address?.building, d.address?.locality, d.address?.pincode]
          .filter(Boolean)
          .join(", ") || "—",
      to: "/address-details",
    },
    {
      icon: "badge",
      title: "Tax Details",
      sub: d.tax?.pan
        ? `PAN ${d.tax.pan}${d.tax.gst ? " · GST added" : ""}`
        : "—",
      to: "/tax-details",
    },
    {
      icon: "account_balance",
      title: "Bank",
      sub: d.bank?.account
        ? `A/c ****${d.bank.account.slice(-4)} · ${d.bank.ifsc}`
        : "—",
      to: "/bank-details",
    },
    {
      icon: "verified",
      title: "FSSAI",
      sub: d.fssai?.license || "—",
      to: "/fssai-details",
    },
    {
      icon: "badge",
      title: "Aadhaar",
      sub: d.aadhaar?.verified ? "Verified" : "—",
      to: "/aadhaar-verification",
    },
    {
      icon: "restaurant",
      title: "About Food",
      sub:
        [d.food?.cuisine, d.food?.category].filter(Boolean).join(" · ") || "—",
      to: "/about-food",
    },
    {
      icon: "photo_camera",
      title: "Kitchen Photos",
      sub: d.photos?.gps ? "GPS-tagged photos added" : "—",
      to: "/kitchen-photos",
    },
  ];

  const incompleteCount = sections.filter((i) => i.sub === "—").length;
  const allComplete = incompleteCount === 0;

  const submit = async () => {
    if (!terms || !privacy)
      return setErr("Please accept the Terms and Privacy Policy to continue.");

    setErr("");
    setSubmitting(true);
    try {
      await api.post("/api/onboarding/submit", { terms: true, privacy: true });
      setVerification("submitted");
      navigate(s.next);
    } catch (error) {
      setErr(
        error.response?.data?.error ||
          error.response?.data?.details?.[0]?.message ||
          "Failed to submit. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <OnboardingLayout step={s.step} stepLabel={s.label}>
      <div className="flex items-center gap-4 mb-stack-lg">
        <div
          className="shrink-0 w-14 h-14 rounded-full flex items-center justify-center"
          style={{ background: BRAND_GRADIENT }}
        >
          <Icon name="fact_check" className="text-white text-[26px]" />
        </div>
        <div>
          <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-1">
            Review your details
          </h2>
          <p className="text-body-md text-on-surface-variant">
            {allComplete
              ? "Everything looks complete."
              : `${incompleteCount} section${incompleteCount > 1 ? "s" : ""} still need attention.`}
          </p>
        </div>
      </div>

      <section className="flex flex-col gap-stack-md">
        {sections.map((item) => {
          const complete = item.sub !== "—";
          return (
            <Card key={item.title} className="p-4 flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                style={{
                  background: complete ? `${BRAND_GRADIENT}` : undefined,
                }}
              >
                <Icon
                  name={item.icon}
                  className={
                    complete ? "text-white" : "text-on-surface-variant"
                  }
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-label-lg text-label-lg text-on-surface">
                    {item.title}
                  </p>
                  {!complete && (
                    <span className="flex items-center gap-1 text-label-sm font-label-sm text-error">
                      <Icon name="warning" className="text-[14px]" />
                      Missing
                    </span>
                  )}
                </div>
                <p className="text-label-sm font-label-sm text-on-surface-variant truncate">
                  {item.sub}
                </p>
              </div>
              <button
                aria-label={`Edit ${item.title}`}
                onClick={() => navigate(item.to)}
                className="text-on-surface-variant active:scale-95 shrink-0"
              >
                <Icon name="edit" className="text-[20px]" />
              </button>
            </Card>
          );
        })}
      </section>

      <div className="mt-stack-lg space-y-stack-md">
        <Consent checked={terms} onChange={setTerms}>
          I agree to the{" "}
          <Link onClick={() => setLegal("terms")}>Terms &amp; Conditions</Link>
        </Consent>
        <Consent checked={privacy} onChange={setPrivacy}>
          I agree to the{" "}
          <Link onClick={() => setLegal("privacy")}>Privacy Policy</Link> and
          KYC verification
        </Consent>
        {err && <p className="text-label-sm font-label-sm text-error">{err}</p>}
        <Button full onClick={submit} disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Application"}
        </Button>
      </div>

      {legal === "terms" && (
        <LegalModal title="Terms & Conditions" onClose={() => setLegal(null)}>
          <TermsContent />
        </LegalModal>
      )}
      {legal === "privacy" && (
        <LegalModal title="Privacy Policy" onClose={() => setLegal(null)}>
          <PrivacyContent />
        </LegalModal>
      )}
    </OnboardingLayout>
  );
}

function Link({ onClick, children }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="text-primary underline font-label-lg"
    >
      {children}
    </button>
  );
}

function Consent({ checked, onChange, children }) {
  return (
    <div className="flex items-start gap-3">
      <button
        type="button"
        onClick={() => onChange(!checked)}
        aria-label="Toggle agreement"
        className={`mt-0.5 w-5 h-5 shrink-0 rounded flex items-center justify-center border transition-all ${
          checked ? "" : "border-outline-variant"
        }`}
        style={
          checked
            ? { background: BRAND_GRADIENT, borderColor: "transparent" }
            : undefined
        }
      >
        {checked && <Icon name="check" className="text-white text-[16px]" />}
      </button>
      <span className="text-body-md text-on-surface-variant">{children}</span>
    </div>
  );
}
