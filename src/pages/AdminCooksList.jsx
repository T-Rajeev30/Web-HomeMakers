import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Chip } from "../components/Card";
import api from "../services/api";

const STATUS_TABS = [
  { value: "manual_review", label: "Manual Review" },
  { value: "verification_pending", label: "Pending KYC" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "draft", label: "Draft" },
  { value: "", label: "All" },
];

const chipTone = {
  draft: "neutral",
  verification_pending: "pending",
  manual_review: "pending",
  approved: "success",
  rejected: "neutral",
};

export default function AdminCooksList() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("manual_review");
  const [data, setData] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    setLoading(true);
    setErr("");
    api
      .get("/api/admin/cooks", {
        params: { status: status || undefined, page: 1, limit: 20 },
      })
      .then((res) => setData(res.data))
      .catch((e) => setErr(e.response?.data?.error || "Failed to load cooks."))
      .finally(() => setLoading(false));
  }, [status]);

  return (
    <main className="px-margin-mobile pt-stack-md pb-stack-lg animate-fade-in">
      <h2 className="text-headline-lg-mobile font-headline-lg-mobile text-on-surface mb-stack-md">
        Cook Applications
      </h2>

      <nav className="flex items-center gap-2 py-stack-sm mb-stack-md overflow-x-auto hide-scrollbar">
        {STATUS_TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setStatus(t.value)}
            className={`px-4 py-2 rounded-full font-label-sm text-label-sm whitespace-nowrap transition-all active:scale-95 ${
              status === t.value
                ? "bg-primary text-on-primary shadow-card"
                : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {err && (
        <p className="text-label-sm font-label-sm text-error mb-stack-md">
          {err}
        </p>
      )}
      {loading && (
        <p className="text-body-md text-on-surface-variant">Loading…</p>
      )}

      <section className="flex flex-col gap-stack-md">
        {!loading && data.items.length === 0 && (
          <p className="text-center text-on-surface-variant py-16 text-body-md">
            No applications in this status.
          </p>
        )}
        {data.items.map((c) => (
          <Card
            key={c._id}
            onClick={() => navigate(`/admin/cooks/${c._id}`)}
            className="p-4 cursor-pointer hover:shadow-lg transition-shadow active:scale-[0.99]"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-headline-md text-headline-md text-on-surface">
                  {c.personal?.name || "—"}
                </h3>
                <p className="text-label-sm font-label-sm text-outline">
                  {c.phone} {c.email ? `· ${c.email}` : ""}
                </p>
              </div>
              <Chip tone={chipTone[c.status] || "neutral"}>{c.status}</Chip>
            </div>
            <div className="flex justify-between items-center text-label-sm font-label-sm text-on-surface-variant">
              <span>
                {c.food?.cuisine || "—"} · Step {c.currentStep}/8
              </span>
              <span>
                {c.kyc?.decision
                  ? `Match ${(c.kyc.name_match_score * 100).toFixed(0)}% · ${c.kyc.decision}`
                  : "KYC pending"}
              </span>
            </div>
          </Card>
        ))}
      </section>
    </main>
  );
}
