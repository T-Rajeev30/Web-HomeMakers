import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OnboardingLayout from "../components/OnboardingLayout";
import { Card } from "../components/Card";
import Button from "../components/Button";
import Icon from "../components/Icon";
import { STEPS, subscriptionPlans } from "../data/onboarding";
import { setVerification } from "../store/useSession";
import { useOnboarding } from "../store/useOnboarding";
import LegalModal, {
  TermsContent,
  PrivacyContent,
} from "../components/LegalModal";

export default function ReviewSubmit() {
  const navigate = useNavigate();
  const s = STEPS.review;
  const d = useOnboarding();
  const [terms, setTerms] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const [legal, setLegal] = useState(null); // "terms" | "privacy" | null
  const [err, setErr] = useState("");

  const planName =
    subscriptionPlans.find((p) => p.id === d.subscription?.plan)?.name || "—";

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
      icon: "restaurant",
      title: "About Food",
      sub:
        [d.food?.cuisine, d.food?.category].filter(Boolean).join(" · ") || "—",
      to: "/about-food",
    },
    {
      icon: "workspace_premium",
      title: "Subscription",
      sub: planName,
      to: "/subscription",
    },
    {
      icon: "photo_camera",
      title: "Kitchen Photos",
      sub: d.photos?.kitchenGps ? "GPS-tagged photos added" : "—",
      to: "/kitchen-photos",
    },
  ];

  const submit = () => {
    if (!terms || !privacy)
      return setErr("Please accept the Terms and Privacy Policy to continue.");
    // Backend: POST /api/onboarding/submit -> runs batch KYC (PAN, bank, FSSAI),
    // logs consent { terms_accepted_at, ip }, sets status = verification_pending.
    setVerification("submitted");
    navigate(s.next);
  };

  return (
    <OnboardingLayout step={s.step} stepLabel={s.label}>
      <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-stack-lg">
        Review your details
      </h2>
      <section className="flex flex-col gap-stack-md">
        {sections.map((item) => (
          <Card key={item.title} className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-primary">
              <Icon name={item.icon} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-label-lg text-label-lg text-on-surface">
                {item.title}
              </p>
              <p className="text-label-sm font-label-sm text-on-surface-variant truncate">
                {item.sub}
              </p>
            </div>
            <button
              aria-label={`Edit ${item.title}`}
              onClick={() => navigate(item.to)}
              className="text-on-surface-variant active:scale-95"
            >
              <Icon name="edit" className="text-[20px]" />
            </button>
          </Card>
        ))}
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
        <Button full onClick={submit}>
          Submit Application
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
          checked
            ? "bg-primary border-primary text-on-primary"
            : "border-outline-variant"
        }`}
      >
        {checked && <Icon name="check" className="text-[16px]" />}
      </button>
      <span className="text-body-md text-on-surface-variant">{children}</span>
    </div>
  );
}
