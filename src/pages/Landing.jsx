import { useNavigate } from "react-router-dom";

const steps = [
  {
    label: "Sign up & verify",
    desc: "Register with your phone number. Quick KYC — PAN, bank, and FSSAI — done in minutes.",
  },
  {
    label: "List your menu",
    desc: "Add your dishes, prices, and photos. You choose your radius, your hours, your prices.",
  },
  {
    label: "Start earning",
    desc: "Orders land on your phone. Payouts land in your bank. No middleman, no guesswork.",
  },
];

const features = [
  {
    title: "Verified & trusted",
    desc: "Every kitchen is KYC and FSSAI verified before it goes live, so customers order with confidence.",
  },
  {
    title: "Fair payouts",
    desc: "A transparent commission and payouts straight to your bank account. No hidden deductions.",
  },
  {
    title: "Runs from your phone",
    desc: "No laptop, no dashboard to learn. Manage orders, menus, and hours from your phone.",
  },
  {
    title: "A team that answers",
    desc: "Real people on the other end when you have a question — not a bot, not a ticket queue.",
  },
];

const faqs = [
  {
    q: "Who can become a homemaker partner?",
    a: "Anyone in Bengaluru who cooks and wants to sell food from home. You'll need a PAN, a bank account, and FSSAI registration — we'll guide you through getting one if you don't already have it.",
  },
  {
    q: "How much does it cost to join?",
    a: "Signing up is free. Zingro takes a transparent commission only on orders you actually receive.",
  },
  {
    q: "How do I get paid?",
    a: "Payouts are transferred directly to your registered bank account on a regular cycle. You can track every order and payment from your phone.",
  },
  {
    q: "Can I set my own hours and prices?",
    a: "Yes. You decide your delivery radius, the hours you're open, and what you charge for each dish.",
  },
  {
    q: "When can customers start ordering?",
    a: "We're onboarding homemaker partners first. The customer app is coming soon — you'll be ready the moment it opens.",
  },
];

function DoorbellMark({ className = "" }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <rect
        x="20"
        y="8"
        width="24"
        height="48"
        rx="10"
        stroke="#ff6b00"
        strokeWidth="2.5"
      />
      <circle cx="32" cy="26" r="6" stroke="#ff6b00" strokeWidth="2.5" />
      <line
        x1="32"
        y1="40"
        x2="32"
        y2="46"
        stroke="#ff6b00"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckIcon({ className = "" }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M4 10.5L8 14.5L16 6"
        stroke="#0051d5"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#fcf9f8", color: "#151c27" }}
    >
      {/* Header */}
      <header
        className="w-full border-b sticky top-0 z-10"
        style={{ borderColor: "#151c2714", backgroundColor: "#fcf9f8" }}
      >
        <div className="max-w-6xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
          <span>
            <img
              src="/logo.png"
              alt="Zingro"
              className="h-8 w-auto object-contain shrink-0"
            />
          </span>
          <a
            href="#faq"
            className="text-sm hover:opacity-70 transition-opacity"
            style={{ color: "#151c27b3", fontWeight: 600 }}
          >
            Questions?
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="w-full">
        <div className="max-w-6xl mx-auto px-6 md:px-10 pt-12 md:pt-20 pb-14 md:pb-24">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Text */}
            <div className="max-w-xl">
              <DoorbellMark className="w-10 h-10 mb-6" />

              <span
                className="inline-block text-xs uppercase tracking-[0.15em] mb-4 px-3 py-1 rounded-full"
                style={{
                  backgroundColor: "#ff6b0014",
                  color: "#ff6b00",
                  fontWeight: 700,
                }}
              >
                Now recruiting in Bengaluru
              </span>

              <h1
                className="text-[32px] sm:text-[38px] md:text-[46px] leading-[1.15] mb-5"
                style={{ fontWeight: 800, letterSpacing: "-0.02em" }}
              >
                We gave home kitchens a doorbell.
              </h1>

              <p
                className="text-base md:text-lg leading-relaxed mb-8 max-w-md"
                style={{ color: "#151c27b3" }}
              >
                Zingro connects home cooks in Bengaluru with neighbours looking
                for a real, home-cooked meal. Turn your kitchen into a verified
                food business — on your own terms.
              </p>

              <button
                onClick={() => navigate("/language")}
                className="w-full sm:w-auto px-8 h-14 rounded-full text-base transition-opacity hover:opacity-90 mb-6"
                style={{
                  backgroundColor: "#ff6b00",
                  color: "#fcf9f8",
                  fontWeight: 700,
                }}
              >
                Become a Homemaker Partner
              </button>

              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {["Free to join", "FSSAI verified", "Payouts to your bank"].map(
                  (item) => (
                    <span
                      key={item}
                      className="flex items-center gap-1.5 text-sm"
                      style={{ color: "#151c27b3", fontWeight: 600 }}
                    >
                      <CheckIcon className="w-4 h-4 shrink-0" />
                      {item}
                    </span>
                  ),
                )}
              </div>
            </div>

            {/* Image */}
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/5] rounded-3xl overflow-hidden">
              <img
                src="/hero-kitchen.png"
                alt="A homemaker cooking in her home kitchen"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="w-full">
        <div
          className="max-w-6xl mx-auto px-6 md:px-10 py-14 md:py-20 border-t"
          style={{ borderColor: "#151c2714" }}
        >
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="max-w-xl">
              <span
                className="text-xs uppercase tracking-[0.15em]"
                style={{ color: "#0051d5", fontWeight: 700 }}
              >
                Getting started
              </span>
              <h2
                className="text-2xl md:text-3xl mt-2 mb-1"
                style={{ fontWeight: 800, letterSpacing: "-0.01em" }}
              >
                From your stove to their doorstep
              </h2>
              <p className="text-base mb-10" style={{ color: "#151c27b3" }}>
                Three steps. About ten minutes.
              </p>

              <div className="flex flex-col gap-10">
                {steps.map((step, i) => (
                  <div key={step.label} className="flex gap-5">
                    <span
                      className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm"
                      style={{
                        backgroundColor: "#0051d5",
                        color: "#fcf9f8",
                        fontWeight: 700,
                      }}
                    >
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="text-lg mb-1" style={{ fontWeight: 700 }}>
                        {step.label}
                      </h3>
                      <p
                        className="text-base leading-relaxed"
                        style={{ color: "#151c27b3" }}
                      >
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Supporting image — hidden on mobile to keep the flow scannable */}
            <div className="hidden lg:block relative w-full aspect-[4/5] rounded-3xl overflow-hidden">
              <img
                src="cook-action.png"
                alt="Close-up of home-cooked dishes being plated"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why homemakers choose Zingro */}
      <section className="w-full">
        <div
          className="max-w-6xl mx-auto px-6 md:px-10 py-14 md:py-20 border-t"
          style={{ borderColor: "#151c2714" }}
        >
          <h2
            className="text-2xl md:text-3xl mb-10"
            style={{ fontWeight: 800, letterSpacing: "-0.01em" }}
          >
            Why homemakers choose Zingro
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f) => (
              <div key={f.title}>
                <h3 className="text-base mb-1.5" style={{ fontWeight: 700 }}>
                  {f.title}
                </h3>
                <p
                  className="text-base leading-relaxed"
                  style={{ color: "#151c27b3" }}
                >
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="w-full">
        <div
          className="max-w-6xl mx-auto px-6 md:px-10 py-14 md:py-20 border-t"
          style={{ borderColor: "#151c2714" }}
        >
          <div
            className="rounded-2xl p-8 md:p-10 max-w-3xl mx-auto flex flex-col sm:flex-row gap-6 items-start sm:items-center"
            style={{ backgroundColor: "#0051d50d" }}
          >
            <div className="w-16 h-16 rounded-full overflow-hidden shrink-0">
              <img
                src="home-pot.png"
                alt="Portrait of a Zingro homemaker partner"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p
                className="text-xl leading-snug mb-3"
                style={{ fontWeight: 700, letterSpacing: "-0.01em" }}
              >
                Every home kitchen has a story worth tasting.
              </p>
              <p className="text-base" style={{ color: "#151c27b3" }}>
                Zingro exists to help you tell yours — and get paid for it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="w-full">
        <div
          className="max-w-3xl mx-auto px-6 md:px-10 py-14 md:py-20 border-t"
          style={{ borderColor: "#151c2714" }}
        >
          <h2
            className="text-2xl md:text-3xl mb-8"
            style={{ fontWeight: 800, letterSpacing: "-0.01em" }}
          >
            Common questions
          </h2>
          <div className="flex flex-col">
            {faqs.map((item, i) => (
              <details
                key={item.q}
                className="group py-5"
                style={{
                  borderTop: i === 0 ? "none" : "1px solid #151c2714",
                }}
              >
                <summary
                  className="flex items-center justify-between cursor-pointer list-none text-base"
                  style={{ fontWeight: 700 }}
                >
                  {item.q}
                  <span
                    className="ml-4 shrink-0 text-lg group-open:rotate-45 transition-transform"
                    style={{ color: "#ff6b00" }}
                  >
                    +
                  </span>
                </summary>
                <p
                  className="text-base leading-relaxed mt-3 max-w-md"
                  style={{ color: "#151c27b3" }}
                >
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="w-full">
        <div
          className="max-w-6xl mx-auto px-6 md:px-10 py-14 md:py-20 border-t"
          style={{ borderColor: "#151c2714" }}
        >
          <div
            className="rounded-2xl p-8 md:p-14 text-center max-w-3xl mx-auto"
            style={{ backgroundColor: "#ff6b00" }}
          >
            <h2
              className="text-2xl md:text-3xl mb-2"
              style={{
                fontWeight: 800,
                color: "#fcf9f8",
                letterSpacing: "-0.01em",
              }}
            >
              Ready to turn your kitchen into a business?
            </h2>
            <p
              className="text-base mb-7"
              style={{ color: "#fcf9f8", opacity: 0.9 }}
            >
              Onboarding takes about ten minutes.
            </p>
            <button
              onClick={() => navigate("/language")}
              className="w-full sm:w-auto px-8 h-14 rounded-full text-base transition-opacity hover:opacity-90"
              style={{
                backgroundColor: "#fcf9f8",
                color: "#ff6b00",
                fontWeight: 700,
              }}
            >
              Become a Homemaker Partner
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="mt-auto w-full border-t"
        style={{ borderColor: "#151c2714" }}
      >
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-10 flex flex-col items-center gap-3 text-center">
          <img
            src="/logo.png"
            alt="Zingro"
            className="h-8 w-auto object-contain shrink-0"
          />

          <button
            onClick={() => navigate("/contact")}
            className="text-sm hover:opacity-70 transition-opacity"
            style={{ color: "#151c27b3", fontWeight: 600 }}
          >
            Contact & Support
          </button>
          <p className="text-sm" style={{ color: "#151c2780" }}>
            © {new Date().getFullYear()} Zingro. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
