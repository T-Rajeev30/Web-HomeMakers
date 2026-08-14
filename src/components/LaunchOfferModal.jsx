import { useNavigate } from "react-router-dom";
import { BRAND_GRADIENT } from "../lib/brand";

export default function LaunchOfferModal({ onClose }) {
  const navigate = useNavigate();

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center px-5"
      style={{
        backgroundColor: "rgba(26,18,5,0.55)",
        backdropFilter: "blur(2px)",
      }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-3xl overflow-hidden bg-white"
        style={{
          boxShadow: "0 30px 70px rgba(0,0,0,.35)",
          animation: "launchOfferIn .45s cubic-bezier(.16,1,.3,1) both",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <style>{`
          @keyframes launchOfferIn {
            from { opacity: 0; transform: scale(.92) translateY(12px); }
            to   { opacity: 1; transform: scale(1) translateY(0); }
          }
        `}</style>

        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center text-white/90 hover:text-white active:scale-90 transition-transform"
          style={{ backgroundColor: "rgba(0,0,0,0.25)" }}
        >
          ✕
        </button>

        <div
          className="px-6 pt-8 pb-7 text-center text-white"
          style={{ background: BRAND_GRADIENT }}
        >
          <span
            className="inline-block text-[11px] font-bold uppercase tracking-[0.14em] px-3 py-1.5 rounded-full mb-4"
            style={{ backgroundColor: "rgba(255,255,255,0.22)" }}
          >
            🎉 Launch Offer
          </span>
          <h2 className="text-[30px] font-extrabold leading-tight mb-1">
            ₹0 Subscription
          </h2>
          <p className="text-base font-semibold opacity-95">for 2 Months</p>
        </div>

        <div className="px-6 py-6 text-center">
          <p className="text-[15px] leading-relaxed text-neutral-700 mb-2">
            Start selling on Zingro with{" "}
            <strong className="text-neutral-900">ZERO subscription fee</strong>{" "}
            for your first 2 months.
          </p>
          <p className="text-[15px] leading-relaxed text-neutral-700 mb-6">
            From the 3rd month, pay just{" "}
            <strong className="text-neutral-900">₹2,500/month</strong> to
            continue your Zingro membership.
          </p>

          <button
            onClick={() => {
              onClose();
              navigate("/language");
            }}
            className="w-full h-13 py-3.5 rounded-full text-white text-[15px] font-bold transition-transform hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: BRAND_GRADIENT,
              boxShadow: "0 12px 28px rgba(255,107,0,.4)",
            }}
          >
            Become a Homemaker Partner →
          </button>

          <button
            onClick={onClose}
            className="mt-3 text-sm text-neutral-500 hover:text-neutral-700 transition-colors"
          >
            Maybe later
          </button>

          <p className="mt-4 text-[13px] text-neutral-500">
            Join early. Grow with Zingro. ❤️
          </p>
        </div>
      </div>
    </div>
  );
}
