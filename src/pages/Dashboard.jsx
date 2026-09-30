import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../components/Card";
import Icon from "../components/Icon";
import api from "../services/api";
import { BRAND_GRADIENT } from "../lib/brand";
import LaunchOfferModal from "../components/LaunchOfferModal";
import { useDishes, fetchDishes } from "../store/useDishes";

function StatCard({
  icon,
  iconClass,
  accent,
  period,
  value,
  valueClass,
  label,
}) {
  return (
    <Card className="relative p-5 rounded-2xl flex flex-col justify-between h-40 overflow-hidden">
      <span
        className="absolute top-0 left-0 right-0 h-1"
        style={{ background: accent }}
      />
      <div className="flex justify-between items-start">
        <span
          className={`material-symbols-outlined p-2 rounded-lg ${iconClass}`}
        >
          {icon}
        </span>
        <span className="text-label-sm font-label-sm text-on-surface-variant">
          {period}
        </span>
      </div>
      <div>
        <span className={`text-[32px] font-bold leading-none ${valueClass}`}>
          {value}
        </span>
        <p className="text-label-lg font-label-lg text-on-surface mt-1">
          {label}
        </p>
      </div>
    </Card>
  );
}

function RecipeCard({ dish }) {
  const [open, setOpen] = useState(false);
  const hasRecipe =
    dish.recipe?.ingredients?.length > 0 || dish.recipe?.steps?.length > 0;
  if (!hasRecipe) return null;

  return (
    <div className="rounded-xl border border-outline-variant overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3 p-3 text-left"
      >
        <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center shrink-0 overflow-hidden">
          {dish.imageUrl ? (
            <img
              src={dish.imageUrl}
              alt={dish.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <Icon name="restaurant" className="text-outline text-[20px]" />
          )}
        </div>
        <span className="flex-1 text-label-lg font-label-lg text-on-surface">
          {dish.name}
        </span>
        <Icon
          name={open ? "expand_less" : "expand_more"}
          className="text-on-surface-variant text-[20px]"
        />
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-3">
          {dish.recipe.ingredients?.length > 0 && (
            <div>
              <p className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider mb-1.5">
                Ingredients
              </p>
              <ul className="space-y-1">
                {dish.recipe.ingredients.map((item, i) => (
                  <li
                    key={i}
                    className="text-body-md text-on-surface flex items-start gap-2"
                  >
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-primary shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {dish.recipe.steps?.length > 0 && (
            <div>
              <p className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider mb-1.5">
                Preparation Steps
              </p>
              <ol className="space-y-1.5">
                {dish.recipe.steps.map((step, i) => (
                  <li
                    key={i}
                    className="text-body-md text-on-surface flex items-start gap-2"
                  >
                    <span className="shrink-0 w-5 h-5 rounded-full bg-surface-container-high text-label-sm font-label-sm flex items-center justify-center">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const STEP_ROUTES = {
  1: "/personal-information",
  2: "/address-details",
  3: "/tax-details",
  4: "/bank-details",
  5: "/fssai-details",
  6: "/about-food",
  7: "/kitchen-photos",
  8: "/review-submit",
};

const BANNER_BY_STATUS = {
  draft: {
    tone: "tertiary",
    icon: "upload_file",
    title: "Complete Verification",
    sub: "Finish onboarding to start receiving orders.",
  },
  verification_pending: {
    tone: "tertiary",
    icon: "hourglass_top",
    title: "Verification Submitted",
    sub: "We've received your documents and are reviewing them.",
  },
  manual_review: {
    tone: "tertiary",
    icon: "schedule",
    title: "Under Review",
    sub: "Your documents are being verified. 24–48 hours.",
  },
  approved: {
    tone: "primary",
    icon: "verified",
    title: "Verified & Approved",
    sub: "Your kitchen is live on ZINGRO.",
  },
  rejected: {
    tone: "error",
    icon: "error",
    title: "Verification Rejected",
    sub: "Please re-upload the flagged documents.",
  },
};

// Maps each banner's `tone` to real classes. Previously `tone` was defined
// but never read — every status rendered with the same tertiary styling,
// so an approved vs. rejected kitchen looked identical on the dashboard.
const BANNER_TONE_STYLES = {
  tertiary: {
    wrap: "border-tertiary-container bg-tertiary-fixed text-on-tertiary-fixed",
    icon: "text-tertiary",
  },
  primary: {
    wrap: "border-transparent text-white",
    icon: "text-white",
    wrapStyle: { background: BRAND_GRADIENT },
  },
  error: {
    wrap: "border-error/30 bg-error-container text-on-error-container",
    icon: "text-error",
  },
};

const monthName = new Date().toLocaleString("default", { month: "long" });

export default function Dashboard() {
  const navigate = useNavigate();
  const [status, setStatus] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLaunchOffer, setShowLaunchOffer] = useState(false);
  const { dishes } = useDishes();

  useEffect(() => {
    Promise.all([
      api.get("/api/onboarding/status"),
      api.get("/api/dashboard/stats"),
    ])
      .then(([statusRes, statsRes]) => {
        setStatus(statusRes.data);
        setStats(statsRes.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
    fetchDishes();
  }, []);

  // Launch offer — same session-scoped key as Landing.jsx, so a homemaker
  // who somehow saw it there doesn't get it twice in the same session.
  // Dashboard is where most homemakers actually land day to day, so this
  // is the one that matters most in practice.
  useEffect(() => {
    if (sessionStorage.getItem("zingro_launch_offer_seen")) return;
    const t = setTimeout(() => {
      setShowLaunchOffer(true);
      sessionStorage.setItem("zingro_launch_offer_seen", "1");
    }, 700);
    return () => clearTimeout(t);
  }, []);

  const banner = status ? BANNER_BY_STATUS[status.status] : null;
  const bannerStyle = banner ? BANNER_TONE_STYLES[banner.tone] : null;
  const bannerTo =
    status?.status === "draft"
      ? STEP_ROUTES[status.currentStep] || "/personal-information"
      : status?.status === "manual_review"
        ? "/under-review"
        : status?.status === "approved"
          ? "/verification-approved"
          : status?.status === "rejected"
            ? "/verification-rejected"
            : "/verification-submitted";

  const dishesWithRecipes = dishes.filter(
    (d) => d.recipe?.ingredients?.length > 0 || d.recipe?.steps?.length > 0,
  );

  return (
    <main className="max-w-md mx-auto px-margin-mobile pt-stack-lg animate-fade-in">
      {showLaunchOffer && (
        <LaunchOfferModal onClose={() => setShowLaunchOffer(false)} />
      )}

      <section className="mb-stack-lg">
        <h1 className="text-headline-lg-mobile font-headline-lg-mobile text-on-surface">
          Namaste{status?.name ? `, ${status.name}` : ""}!
        </h1>
        <p className="text-body-md text-on-surface-variant">
          Here is what's happening in your kitchen today.
        </p>
      </section>

      {banner && (
        <button
          onClick={() => navigate(bannerTo)}
          className={`w-full flex items-center gap-4 p-4 mb-stack-lg rounded-xl border shadow-card text-left transition-transform active:scale-[0.99] ${bannerStyle.wrap}`}
          style={bannerStyle.wrapStyle}
        >
          <Icon name={banner.icon} className={bannerStyle.icon} />
          <div className="flex-1">
            <p className="text-label-lg font-label-lg">{banner.title}</p>
            <p className="text-label-sm font-label-sm opacity-80">
              {banner.sub}
            </p>
          </div>
          <Icon name="chevron_right" />
        </button>
      )}

      <div className="grid grid-cols-2 gap-4">
        <StatCard
          icon="shopping_basket"
          iconClass="text-primary bg-primary-fixed"
          accent="linear-gradient(90deg, #FA8C0A, #F05A64)"
          period="Today"
          value={loading ? "—" : (stats?.todayOrders ?? 0)}
          valueClass="text-primary"
          label="Orders Received"
        />
        <StatCard
          icon="payments"
          iconClass="text-secondary bg-secondary-fixed"
          accent="linear-gradient(90deg, #E63C78, #7832F0)"
          period={monthName}
          value={
            loading
              ? "—"
              : `₹${(stats?.monthEarnings ?? 0).toLocaleString("en-IN")}`
          }
          valueClass="text-secondary"
          label="Earnings"
        />
      </div>

      <div className="mt-stack-lg">
        <h2 className="text-label-lg font-label-lg text-on-surface-variant mb-3 uppercase tracking-wider">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate("/menu/add")}
            className="flex flex-col items-center justify-center gap-3 p-4 text-white rounded-2xl min-h-[100px] active:scale-95 transition-all shadow-card"
            style={{ background: BRAND_GRADIENT }}
          >
            <Icon name="add_circle" className="text-[32px]" />
            <span className="font-label-lg text-label-lg">Add New Dish</span>
          </button>
          <button
            onClick={() => navigate("/orders")}
            className="flex flex-col items-center justify-center gap-3 p-4 bg-surface-container-highest text-primary rounded-2xl min-h-[100px] active:scale-95 transition-all border border-outline-variant"
          >
            <Icon name="list_alt" className="text-[32px]" />
            <span className="font-label-lg text-label-lg">View Orders</span>
          </button>
        </div>
      </div>

      {dishesWithRecipes.length > 0 && (
        <Card className="p-4 rounded-2xl mt-stack-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-headline-md font-headline-md flex items-center gap-2">
              <Icon name="receipt_long" className="text-[20px] text-primary" />
              Your Recipes (SOPs)
            </h3>
            <button
              onClick={() => navigate("/menu")}
              className="text-primary text-label-lg font-label-lg"
            >
              See All
            </button>
          </div>
          <div className="space-y-2">
            {dishesWithRecipes.slice(0, 5).map((dish) => (
              <RecipeCard key={dish._id} dish={dish} />
            ))}
          </div>
        </Card>
      )}

      <Card className="p-4 rounded-2xl mt-stack-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-headline-md font-headline-md">Recent Activity</h3>
          <button
            onClick={() => navigate("/orders")}
            className="text-primary text-label-lg font-label-lg"
          >
            See All
          </button>
        </div>
        {!loading &&
          (!stats?.recentActivity || stats.recentActivity.length === 0) && (
            <p className="text-body-md text-on-surface-variant text-center py-6">
              No activity yet. Orders will show up here.
            </p>
          )}
        <div className="space-y-4">
          {stats?.recentActivity?.map((a, i) => (
            <div key={a.orderId || i}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-secondary-fixed text-secondary">
                  <Icon name={a.icon} fill={a.fill} />
                </div>
                <div className="flex-1">
                  <p className="text-label-lg font-label-lg">{a.title}</p>
                  <p className="text-label-sm font-label-sm text-on-surface-variant">
                    {a.sub}
                  </p>
                </div>
                <span className="text-label-sm font-label-sm text-on-surface-variant">
                  {a.time}
                </span>
              </div>
              {i < stats.recentActivity.length - 1 && (
                <hr className="border-outline-variant mt-4" />
              )}
            </div>
          ))}
        </div>
      </Card>
    </main>
  );
}
