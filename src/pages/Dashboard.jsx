import { useNavigate } from "react-router-dom";
import { Card } from "../components/Card";
import Icon from "../components/Icon";
import { recentActivity } from "../data/mock";

function StatCard({ icon, iconClass, period, value, valueClass, label }) {
  return (
    <Card className="p-5 rounded-2xl flex flex-col justify-between h-40">
      <div className="flex justify-between items-start">
        <span className={`material-symbols-outlined p-2 rounded-lg ${iconClass}`}>{icon}</span>
        <span className="text-label-sm font-label-sm text-on-surface-variant">{period}</span>
      </div>
      <div>
        <span className={`text-[32px] font-bold leading-none ${valueClass}`}>{value}</span>
        <p className="text-label-lg font-label-lg text-on-surface mt-1">{label}</p>
      </div>
    </Card>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  return (
    <main className="max-w-md mx-auto px-margin-mobile pt-stack-lg animate-fade-in">
      <section className="mb-stack-lg">
        <h1 className="text-headline-lg-mobile font-headline-lg-mobile text-on-surface">Namaste, Sunita!</h1>
        <p className="text-body-md text-on-surface-variant">
          Here is what's happening in your kitchen today.
        </p>
      </section>

      <button
        onClick={() => navigate("/document-upload")}
        className="w-full flex items-center gap-4 p-4 mb-stack-lg rounded-xl border border-tertiary-container bg-tertiary-fixed text-on-tertiary-fixed shadow-card text-left"
      >
        <Icon name="verified_user" className="text-tertiary" />
        <div className="flex-1">
          <p className="text-label-lg font-label-lg">Verification Pending</p>
          <p className="text-label-sm font-label-sm opacity-80">
            Finish uploading your FSSAI certificate to start receiving orders.
          </p>
        </div>
        <Icon name="chevron_right" />
      </button>

      <div className="grid grid-cols-2 gap-4">
        <StatCard
          icon="shopping_basket"
          iconClass="text-primary bg-primary-fixed"
          period="Today"
          value="12"
          valueClass="text-primary"
          label="Orders Received"
        />
        <StatCard
          icon="payments"
          iconClass="text-secondary bg-secondary-fixed"
          period="March"
          value="₹8.4k"
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
            onClick={() => navigate("/menu")}
            className="flex flex-col items-center justify-center gap-3 p-4 bg-primary text-on-primary rounded-2xl min-h-[100px] active:scale-95 transition-all shadow-card"
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

      <Card className="p-4 rounded-2xl mt-stack-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-headline-md font-headline-md">Recent Activity</h3>
          <button className="text-primary text-label-lg font-label-lg">See All</button>
        </div>
        <div className="space-y-4">
          {recentActivity.map((a, i) => (
            <div key={i}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-secondary-fixed text-secondary">
                  <Icon name={a.icon} fill={a.fill} />
                </div>
                <div className="flex-1">
                  <p className="text-label-lg font-label-lg">{a.title}</p>
                  <p className="text-label-sm font-label-sm text-on-surface-variant">{a.sub}</p>
                </div>
                <span className="text-label-sm font-label-sm text-on-surface-variant">{a.time}</span>
              </div>
              {i < recentActivity.length - 1 && <hr className="border-outline-variant mt-4" />}
            </div>
          ))}
        </div>
      </Card>
    </main>
  );
}
