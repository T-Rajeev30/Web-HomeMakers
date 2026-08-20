import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import LaunchOfferModal from "../components/LaunchOfferModal";
import ComplianceFooter from "../components/ComplianceFooter";

/* ============================================================================
   ZINGRO — BRAND TOKENS
   Pulled from the existing identity: cream canvas, ink text, warm gradient
   accents (orange → berry → plum) drawn straight from the logo mark.
   ============================================================================ */
const C = {
  ink: "#1a1205",
  cream: "#fffaf2",
  paper: "#fff6ea",
  orange: "#ff6b00",
  orangeDeep: "#e85d00",
  saffron: "#ffab2e",
  berry: "#c81e5a",
  plum: "#6b2d8f",
  teal: "#0fb59b",
  muted: "#5c4f3d",
};
const GRAD = `linear-gradient(120deg, ${C.orange} 0%, ${C.berry} 55%, ${C.plum} 100%)`;

/* ============================================================================
   useReveal — lightweight scroll-reveal hook (no deps).
   Fires once when the element enters the viewport, then stays revealed.
   ============================================================================ */
function useReveal(threshold = 0.2) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, inView];
}

/** Reveal — wraps children in a fade/rise/scale transition tied to scroll. */
function Reveal({
  children,
  as: Tag = "div",
  direction = "up",
  delay = 0,
  className = "",
  style = {},
}) {
  const [ref, inView] = useReveal();
  const hidden = {
    up: "translateY(28px)",
    left: "translateX(-28px)",
    right: "translateX(28px)",
    scale: "scale(0.94)",
  }[direction];
  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : hidden,
        transition: `opacity .8s cubic-bezier(.16,1,.3,1) ${delay}ms, transform .8s cubic-bezier(.16,1,.3,1) ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}

/* ============================================================================
   DoorGraphic — the recurring visual motif. Two panels that swing open
   (via CSS 3D rotate) the moment the section scrolls into view.
   ============================================================================ */
function DoorGraphic({ open, className = "" }) {
  return (
    <div className={`relative ${className}`} style={{ perspective: "1400px" }}>
      <div
        className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden"
        style={{ backgroundColor: "#241708" }}
      >
        {/* warm light glowing from "inside" once opened */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 50% 55%, ${C.saffron}55, transparent 65%)`,
            opacity: open ? 1 : 0,
            transition: "opacity 1.1s ease .3s",
          }}
        />
        {/* left panel */}
        <div
          className="absolute inset-y-0 left-0 w-1/2 border-r"
          style={{
            background: `linear-gradient(160deg, ${C.orangeDeep}, ${C.ink})`,
            borderColor: "#00000040",
            transformOrigin: "left center",
            transform: open ? "rotateY(-58deg)" : "rotateY(0deg)",
            transition: "transform 1.2s cubic-bezier(.16,1,.3,1)",
          }}
        >
          <div
            className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
            style={{ backgroundColor: C.saffron }}
          />
        </div>
        {/* right panel */}
        <div
          className="absolute inset-y-0 right-0 w-1/2"
          style={{
            background: `linear-gradient(200deg, ${C.plum}, ${C.ink})`,
            transformOrigin: "right center",
            transform: open ? "rotateY(58deg)" : "rotateY(0deg)",
            transition: "transform 1.2s cubic-bezier(.16,1,.3,1)",
          }}
        >
          <div
            className="absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
            style={{ backgroundColor: C.saffron }}
          />
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   PhoneMock — a believable order-flow, not a dashboard.
   ============================================================================ */
function PhoneMock() {
  const frames = [
    {
      label: "Order received",
      sub: "2 × Rajma Chawal · ₹240",
      color: C.orange,
    },
    { label: "Preparing…", sub: "2 × Rajma Chawal · ₹240", color: C.saffron },
    { label: "Order ready", sub: "Handed to delivery partner", color: C.teal },
    {
      label: "Payment received",
      sub: "₹240 credited to your bank",
      color: C.plum,
    },
  ];
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % frames.length), 2200);
    return () => clearInterval(t);
  }, [frames.length]);
  const f = frames[i];

  return (
    <div className="mx-auto" style={{ width: 240 }}>
      <div
        className="rounded-[2.2rem] p-3"
        style={{
          backgroundColor: C.ink,
          boxShadow: "0 30px 60px rgba(0,0,0,.28)",
        }}
      >
        <div
          className="rounded-[1.6rem] overflow-hidden"
          style={{ backgroundColor: C.paper, minHeight: 300 }}
        >
          <div
            className="px-4 pt-5 pb-3"
            style={{ borderBottom: `1px solid ${C.ink}12` }}
          >
            <p
              className="text-[11px] uppercase tracking-[0.15em]"
              style={{ color: C.muted, fontWeight: 700 }}
            >
              Zingro · your kitchen
            </p>
          </div>
          <div className="p-4 flex flex-col gap-3">
            <div
              className="rounded-2xl p-4 transition-colors duration-700"
              style={{ backgroundColor: `${f.color}18` }}
            >
              <p
                className="text-[15px] mb-1 transition-colors duration-700"
                style={{ color: f.color, fontWeight: 800 }}
              >
                {f.label}
              </p>
              <p className="text-[12px]" style={{ color: C.muted }}>
                {f.sub}
              </p>
            </div>
            <div className="flex gap-1.5 justify-center pt-1">
              {frames.map((_, idx) => (
                <span
                  key={idx}
                  className="h-1.5 rounded-full transition-all duration-500"
                  style={{
                    width: idx === i ? 18 : 6,
                    backgroundColor: idx === i ? f.color : `${C.ink}20`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   Small text data — preserved verbatim from the existing product surface.
   ============================================================================ */
const homemakerJourney = [
  {
    n: "01",
    t: "You already know how to cook",
    d: "That's the whole starting point. No course, no certification to invent.",
  },
  {
    n: "02",
    t: "You decide what you sell",
    d: "List your dishes, your prices, your photos — it's your menu, not a template.",
  },
  {
    n: "03",
    t: "You decide your hours",
    d: "Cook when you can. Close when you can't. The kitchen runs on your time.",
  },
  {
    n: "04",
    t: "You decide your radius",
    d: "Choose how far your food travels. Start small, grow as you're ready.",
  },
  {
    n: "05",
    t: "Orders arrive on your phone",
    d: "No dashboard to learn. Orders land where you already are.",
  },
  {
    n: "06",
    t: "You get paid on schedule",
    d: "Zingro settles your earnings to your bank account each cycle, net of commission and any statutory deductions, in line with the Chef Partner Terms.",
  },
];

const customerJourney = [
  "A hungry neighbour opens Zingro",
  "Discovers a home kitchen nearby",
  "Views the Chef Partner's approved profile",
  "Orders a real, home-cooked meal",
  "Food arrives — the kitchen earns",
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

/* ============================================================================
   PAGE
   Narrative order: person → kitchen → door → neighbourhood → network.
   ============================================================================ */
export default function Landing() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [showStickyCta, setShowStickyCta] = useState(false);
  const [showLaunchOffer, setShowLaunchOffer] = useState(false);
  const [doorRef, doorOpen] = useReveal(0.35);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      setShowStickyCta(window.scrollY > 640);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Launch offer — once per browser session, not on every reload/navigation
  // back to the landing page. Clears when the tab/browser closes, so it
  // resurfaces for a fresh visit (this is a live, time-bound promo).
  useEffect(() => {
    if (sessionStorage.getItem("zingro_launch_offer_seen")) return;
    const t = setTimeout(() => {
      setShowLaunchOffer(true);
      sessionStorage.setItem("zingro_launch_offer_seen", "1");
    }, 900);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: C.cream, color: C.ink }}
    >
      {showLaunchOffer && (
        <LaunchOfferModal onClose={() => setShowLaunchOffer(false)} />
      )}
      {/* ---------- HEADER ---------- */}
      <header
        className="w-full sticky top-0 z-30 transition-all duration-300"
        style={{
          backgroundColor: scrolled ? `${C.cream}f2` : `${C.cream}00`,
          backdropFilter: scrolled ? "blur(14px)" : "none",
          borderBottom: scrolled
            ? `1px solid ${C.ink}12`
            : "1px solid transparent",
        }}
      >
        <div
          className={`max-w-6xl mx-auto px-6 md:px-10 flex items-center justify-between transition-all duration-300 ${scrolled ? "h-14" : "h-16"}`}
        >
          <img
            src="/logo.png"
            alt="Zingro"
            className="w-auto object-contain shrink-0 transition-all duration-300"
            style={{ height: scrolled ? 28 : 32 }}
          />
          <div className="flex items-center gap-5">
            <a
              href="#faq"
              className="text-sm hover:opacity-70 transition-opacity hidden sm:block"
              style={{ color: C.muted, fontWeight: 600 }}
            >
              Questions?
            </a>
            <button
              onClick={() => navigate("/language")}
              className="px-5 h-10 rounded-full text-sm text-white transition-transform hover:scale-105"
              style={{
                background: GRAD,
                fontWeight: 700,
                boxShadow: `0 8px 20px ${C.orange}40`,
              }}
            >
              Become a partner
            </button>
          </div>
        </div>
      </header>

      {/* ============================================================
          ACT 1 — CINEMATIC HERO / THE INVISIBLE KITCHEN
          ============================================================ */}
      <section
        className="relative w-full overflow-hidden"
        style={{ minHeight: "88vh" }}
      >
        <img
          src="/hero-kitchen.png"
          alt="A homemaker cooking in her home kitchen"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, ${C.ink}30 0%, ${C.ink}75 78%, ${C.ink}95 100%)`,
          }}
        />

        <div
          className="relative z-10 max-w-4xl mx-auto px-6 md:px-10 flex flex-col justify-end"
          style={{
            minHeight: "88vh",
            paddingBottom: "4rem",
            paddingTop: "6rem",
          }}
        >
          <Reveal direction="up">
            <p
              className="text-sm md:text-base mb-4"
              style={{
                color: C.saffron,
                fontWeight: 700,
                letterSpacing: "0.02em",
              }}
            >
              Behind every neighbourhood is a kitchen you haven't discovered
              yet.
            </p>
          </Reveal>
          <Reveal direction="up" delay={120}>
            <h1
              className="text-white text-[40px] sm:text-[54px] md:text-[68px] leading-[0.98] mb-6"
              style={{ fontWeight: 800, letterSpacing: "-0.035em" }}
            >
              EVERY
              <br />
              KITCHEN
              <br />
              HAS A STORY.
            </h1>
          </Reveal>
          <Reveal direction="up" delay={240}>
            <p className="text-white/85 text-base md:text-lg max-w-md mb-8 leading-relaxed">
              We gave those kitchens a doorbell.
            </p>
          </Reveal>
          <Reveal direction="up" delay={360}>
            <button
              onClick={() => navigate("/language")}
              className="w-fit px-8 h-13 py-3.5 rounded-full text-sm md:text-base text-white transition-transform hover:scale-105"
              style={{
                background: GRAD,
                fontWeight: 700,
                boxShadow: `0 16px 40px ${C.orange}55`,
              }}
            >
              Become a Homemaker Partner →
            </button>
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          ACT 2 — THE PROBLEM: great food stays behind the door
          ============================================================ */}
      <section
        className="w-full py-20 md:py-28"
        style={{ backgroundColor: C.cream }}
      >
        <div className="max-w-6xl mx-auto px-6 md:px-10 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <Reveal direction="left">
            <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden">
              <img
                src="cook-action.png"
                alt="Close-up of home-cooked dishes being plated"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </Reveal>
          <Reveal direction="right" delay={100}>
            <div className="max-w-lg">
              <p
                className="text-xs uppercase tracking-[0.15em] mb-4"
                style={{ color: C.berry, fontWeight: 700 }}
              >
                The problem
              </p>
              <h2
                className="text-3xl md:text-[44px] leading-[1.05] mb-6"
                style={{ fontWeight: 800, letterSpacing: "-0.02em" }}
              >
                The food is
                <br />
                already there.
              </h2>
              <p
                className="text-base md:text-lg leading-relaxed mb-4"
                style={{ color: C.muted }}
              >
                The best food in your neighbourhood might already be cooking
                next door. Real recipes. Real kitchens. Real hands.
              </p>
              <p
                className="text-base md:text-lg leading-relaxed"
                style={{ color: C.muted }}
              >
                But how does it reach you? Discovery, trust, payments, customers
                — the food usually stops at the front door.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          ACT 3 — ZINGRO OPENS THE DOOR (visual centerpiece)
          ============================================================ */}
      <section
        ref={doorRef}
        className="w-full py-20 md:py-28"
        style={{ backgroundColor: C.ink }}
      >
        <div className="max-w-6xl mx-auto px-6 md:px-10 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <Reveal direction="up">
            <div className="max-w-lg order-2 lg:order-1">
              <p
                className="text-xs uppercase tracking-[0.15em] mb-4"
                style={{ color: C.saffron, fontWeight: 700 }}
              >
                Then, Zingro
              </p>
              <h2
                className="text-white text-3xl md:text-[44px] leading-[1.05] mb-6"
                style={{ fontWeight: 800, letterSpacing: "-0.02em" }}
              >
                Then we opened
                <br />
                the door.
              </h2>
              <p className="text-white/70 text-base md:text-lg leading-relaxed mb-10">
                Zingro connects home cooks with people nearby looking for
                something real — food made by someone, not something.
              </p>

              {/* the flow: Home kitchen → Zingro → Neighbourhood → Customer */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-3">
                {["Home kitchen", "Zingro", "Neighbourhood", "Customer"].map(
                  (step, idx) => (
                    <div key={step} className="flex items-center gap-3">
                      <span
                        className="px-4 py-2 rounded-full text-xs sm:text-sm text-white"
                        style={{
                          backgroundColor:
                            idx === 1 ? "transparent" : "#ffffff14",
                          fontWeight: 700,
                          background: idx === 1 ? GRAD : "#ffffff14",
                        }}
                      >
                        {step}
                      </span>
                      {idx < 3 && <span className="text-white/40">→</span>}
                    </div>
                  ),
                )}
              </div>
            </div>
          </Reveal>

          <div className="order-1 lg:order-2">
            <DoorGraphic open={doorOpen} className="max-w-sm mx-auto" />
          </div>
        </div>
      </section>

      {/* ============================================================
          ACT 4 — THE HOMEMAKER'S JOURNEY
          ============================================================ */}
      <section
        className="w-full py-20 md:py-28"
        style={{ backgroundColor: C.cream }}
      >
        <div className="max-w-3xl mx-auto px-6 md:px-10">
          <Reveal direction="up">
            <p
              className="text-xs uppercase tracking-[0.15em] mb-3"
              style={{ color: C.orange, fontWeight: 700 }}
            >
              For the homemaker
            </p>
            <h2
              className="text-3xl md:text-[44px] leading-[1.05] mb-4"
              style={{ fontWeight: 800, letterSpacing: "-0.02em" }}
            >
              Run your kitchen,
              <br />
              within Zingro's Terms.
            </h2>
          </Reveal>

          <div className="mt-12 flex flex-col">
            {homemakerJourney.map((item, i) => (
              <Reveal key={item.n} direction="up" delay={i * 60}>
                <div
                  className="flex items-start gap-6 py-7"
                  style={{
                    borderTop: i === 0 ? "none" : `1px solid ${C.ink}12`,
                  }}
                >
                  <span
                    className="shrink-0 text-3xl md:text-4xl"
                    style={{
                      fontWeight: 800,
                      letterSpacing: "-0.02em",
                      color: `${C.ink}25`,
                    }}
                  >
                    {item.n}
                  </span>
                  <div>
                    <h3
                      className="text-lg md:text-xl mb-1"
                      style={{ fontWeight: 700 }}
                    >
                      {item.t}
                    </h3>
                    <p
                      className="text-[15px] leading-relaxed"
                      style={{ color: C.muted }}
                    >
                      {item.d}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          ACT 4b — PHONE-BASED ORDERING (not a dashboard, a tool)
          ============================================================ */}
      <section
        className="w-full py-20 md:py-28"
        style={{ backgroundColor: C.paper }}
      >
        <div className="max-w-6xl mx-auto px-6 md:px-10 grid lg:grid-cols-2 gap-14 items-center">
          <Reveal direction="left">
            <PhoneMock />
          </Reveal>
          <Reveal direction="right" delay={100}>
            <div className="max-w-md">
              <p
                className="text-xs uppercase tracking-[0.15em] mb-4"
                style={{ color: C.plum, fontWeight: 700 }}
              >
                Runs from your phone
              </p>
              <h2
                className="text-3xl md:text-[40px] leading-[1.08] mb-6"
                style={{ fontWeight: 800, letterSpacing: "-0.02em" }}
              >
                No dashboard
                <br />
                to learn.
              </h2>
              <p
                className="text-base md:text-lg leading-relaxed"
                style={{ color: C.muted }}
              >
                Orders arrive, get prepared, and get paid for — all from the
                phone you already carry. If you can send a WhatsApp message, you
                can run this.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          ACT 5 — TRUST
          ============================================================ */}
      <section
        className="w-full py-20 md:py-28"
        style={{ backgroundColor: C.ink }}
      >
        <div className="max-w-3xl mx-auto px-6 md:px-10">
          <Reveal direction="up">
            <p
              className="text-xs uppercase tracking-[0.15em] mb-3"
              style={{ color: C.teal, fontWeight: 700 }}
            >
              Trust
            </p>
            <h2
              className="text-white text-3xl md:text-[42px] leading-[1.08] mb-5"
              style={{ fontWeight: 800, letterSpacing: "-0.02em" }}
            >
              Home-cooked doesn't
              <br />
              have to mean unknown.
            </h2>
            <p className="text-white/65 text-base md:text-lg leading-relaxed max-w-lg mb-12">
              Before a kitchen goes live, we verify who's behind it — every Chef
              Partner is checked before they can take an order.
            </p>
          </Reveal>

          <div className="flex flex-col">
            {[
              [
                "KYC verified",
                "Every homemaker partner is identity-verified before going live.",
              ],
              [
                "FSSAI registered",
                "Food safety registration is part of onboarding, not an afterthought.",
              ],
              [
                "Transparent payouts",
                "Commission is disclosed upfront, with any permitted deductions itemised in your settlement statement.",
              ],
            ].map(([t, d], i) => (
              <Reveal key={t} direction="up" delay={i * 80}>
                <div
                  className="flex items-baseline justify-between gap-6 py-6"
                  style={{ borderTop: `1px solid #ffffff1a` }}
                >
                  <h3
                    className="text-white text-lg md:text-xl shrink-0"
                    style={{ fontWeight: 700 }}
                  >
                    {t}
                  </h3>
                  <p className="text-white/60 text-sm md:text-base text-right max-w-sm">
                    {d}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          ACT 6 — THE CUSTOMER / NEIGHBOUR SIDE
          ============================================================ */}
      <section
        className="w-full py-20 md:py-28"
        style={{ backgroundColor: C.cream }}
      >
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <Reveal direction="up">
            <p
              className="text-xs uppercase tracking-[0.15em] mb-3"
              style={{ color: C.berry, fontWeight: 700 }}
            >
              For the neighbour
            </p>
            <h2
              className="text-3xl md:text-[44px] leading-[1.05] mb-4 max-w-lg"
              style={{ fontWeight: 800, letterSpacing: "-0.02em" }}
            >
              Food that tastes like
              <br />
              someone made it.
            </h2>
            <p
              className="text-base md:text-lg leading-relaxed max-w-lg mb-14"
              style={{ color: C.muted }}
            >
              One order helps both sides. The homemaker earns. The neighbour
              gets a real meal. The neighbourhood gets a little more connected.
            </p>
          </Reveal>

          <div className="flex flex-col md:flex-row md:items-stretch gap-3 md:gap-0">
            {customerJourney.map((step, i) => (
              <Reveal
                key={step}
                direction="up"
                delay={i * 70}
                className="flex-1"
              >
                <div
                  className="h-full flex md:flex-col items-center md:items-start gap-4 md:gap-3 py-5 md:py-0 md:pr-5"
                  style={{ borderTop: `1px solid ${C.ink}14` }}
                >
                  <span
                    className="shrink-0 w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center text-xs md:text-sm text-white"
                    style={{ background: GRAD, fontWeight: 700 }}
                  >
                    {i + 1}
                  </span>
                  <p
                    className="text-[15px] md:text-base leading-snug"
                    style={{ fontWeight: 600 }}
                  >
                    {step}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          ACT 7 — THE BIGGER VISION
          ============================================================ */}
      <section
        className="w-full py-24 md:py-36 text-center"
        style={{ backgroundColor: C.ink }}
      >
        <div className="max-w-3xl mx-auto px-6 md:px-10">
          <Reveal direction="scale">
            <p
              className="text-sm md:text-base mb-6"
              style={{ color: C.saffron, fontWeight: 700 }}
            >
              A neighbourhood is more than restaurants.
            </p>
          </Reveal>
          <Reveal direction="scale" delay={140}>
            <h2
              className="text-white text-3xl md:text-5xl leading-[1.1] mb-8"
              style={{ fontWeight: 800, letterSpacing: "-0.02em" }}
            >
              Sometimes, the best meal
              <br />
              is being made three doors away.
            </h2>
          </Reveal>
          <Reveal direction="scale" delay={280}>
            <div
              className="flex items-center justify-center gap-3 text-white/55 text-sm flex-wrap"
              style={{ fontWeight: 600 }}
            >
              <span>One kitchen</span>
              <span>→</span>
              <span>One neighbourhood</span>
              <span>→</span>
              <span>A network of home kitchens</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- QUOTE / BRAND MOMENT ---------- */}
      <section
        className="w-full py-20 md:py-28"
        style={{ backgroundColor: C.cream }}
      >
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <Reveal direction="up">
            <div
              className="rounded-2xl p-8 md:p-12 max-w-3xl mx-auto flex flex-col sm:flex-row gap-6 items-start sm:items-center"
              style={{ background: `${C.plum}0d` }}
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
                  className="text-xl md:text-2xl leading-snug mb-3"
                  style={{ fontWeight: 700, letterSpacing: "-0.01em" }}
                >
                  Every home kitchen has a story worth tasting.
                </p>
                <p className="text-base" style={{ color: C.muted }}>
                  Zingro exists to help you tell yours — and get paid for it.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section
        id="faq"
        className="w-full py-20 md:py-28"
        style={{ backgroundColor: C.cream }}
      >
        <div className="max-w-3xl mx-auto px-6 md:px-10">
          <Reveal direction="up">
            <h2
              className="text-2xl md:text-3xl mb-8"
              style={{ fontWeight: 800, letterSpacing: "-0.01em" }}
            >
              Common questions
            </h2>
          </Reveal>
          <div className="flex flex-col">
            {faqs.map((item, i) => (
              <details
                key={item.q}
                className="group py-5"
                style={{ borderTop: i === 0 ? "none" : `1px solid ${C.ink}14` }}
              >
                <summary
                  className="flex items-center justify-between cursor-pointer list-none text-base"
                  style={{ fontWeight: 700 }}
                >
                  {item.q}
                  <span
                    className="ml-4 shrink-0 text-lg group-open:rotate-45 transition-transform"
                    style={{ color: C.orange }}
                  >
                    +
                  </span>
                </summary>
                <p
                  className="text-base leading-relaxed mt-3 max-w-md"
                  style={{ color: C.muted }}
                >
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          FINAL CTA — closes the narrative loop the hero opened
          ============================================================ */}
      <section
        className="w-full py-20 md:py-28"
        style={{ backgroundColor: C.cream }}
      >
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <Reveal direction="up">
            <div
              className="rounded-2xl p-10 md:p-16 text-center max-w-3xl mx-auto relative overflow-hidden"
              style={{ background: GRAD }}
            >
              <h2
                className="text-2xl md:text-4xl mb-3 text-white"
                style={{ fontWeight: 800, letterSpacing: "-0.015em" }}
              >
                Your kitchen is already ready.
              </h2>
              <p
                className="text-lg md:text-xl mb-8 text-white/90"
                style={{ fontWeight: 600 }}
              >
                Let's open the door.
              </p>
              <button
                onClick={() => navigate("/language")}
                className="px-8 h-14 rounded-full text-base transition-transform hover:scale-105"
                style={{
                  backgroundColor: C.cream,
                  color: C.orangeDeep,
                  fontWeight: 700,
                }}
              >
                Become a Homemaker Partner →
              </button>
              <p
                className="text-white/80 text-sm mt-6"
                style={{ fontWeight: 600 }}
              >
                Free to join · KYC & FSSAI verified · Manage everything from
                your phone
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- FOOTER ---------- */}
      <footer
        className="mt-auto w-full border-t"
        style={{ borderColor: `${C.ink}14` }}
      >
        <div className="max-w-4xl mx-auto px-6 md:px-10 py-10 flex flex-col items-center gap-6 text-center">
          <img
            src="/logo.png"
            alt="Zingro"
            className="h-8 w-auto object-contain shrink-0"
          />
          <button
            onClick={() => navigate("/contact")}
            className="text-sm hover:opacity-70 transition-opacity"
            style={{ color: C.muted, fontWeight: 600 }}
          >
            Contact & Support
          </button>
          <ComplianceFooter className="w-full" />
          <p className="text-sm" style={{ color: `${C.ink}80` }}>
            © {new Date().getFullYear()} Zingro. All rights reserved.
          </p>
        </div>
      </footer>

      {/* ---------- STICKY MOBILE CTA ---------- */}
      <div
        className="fixed bottom-0 inset-x-0 z-40 sm:hidden px-4 pb-4 pt-3 transition-transform duration-300"
        style={{
          transform: showStickyCta ? "translateY(0)" : "translateY(120%)",
          background: `linear-gradient(180deg, ${C.cream}00, ${C.cream} 30%)`,
        }}
      >
        <button
          onClick={() => navigate("/language")}
          className="w-full h-13 py-3.5 rounded-full text-sm text-white"
          style={{
            background: GRAD,
            fontWeight: 700,
            boxShadow: `0 12px 30px ${C.orange}55`,
          }}
        >
          Become a Homemaker Partner →
        </button>
      </div>
    </div>
  );
}
