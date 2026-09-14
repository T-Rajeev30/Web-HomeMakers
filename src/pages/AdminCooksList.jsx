import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, Chip } from "../components/Card";
import Icon from "../components/Icon";
import api from "../services/api";
import { BRAND_GRADIENT } from "../lib/brand";

const STATUS_TABS = [
  { value: "manual_review", label: "Manual Review" },
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
  rejected: "error",
};

const LIMIT = 20;

function RemindButton({ cookId }) {
  const [state, setState] = useState("idle");

  const send = async (e) => {
    e.stopPropagation();
    setState("sending");
    try {
      await api.post(`/api/admin/cooks/${cookId}/remind`);
      setState("sent");
    } catch {
      setState("error");
    }
  };

  return (
    <button
      onClick={send}
      disabled={state === "sending" || state === "sent"}
      className="mt-2 w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-surface-container-high text-on-surface-variant text-label-sm font-label-sm disabled:opacity-60 active:scale-[0.98] transition-all"
    >
      <Icon
        name={state === "sent" ? "check" : "mail"}
        className="text-[16px]"
      />
      {state === "idle" && "Send reminder"}
      {state === "sending" && "Sending..."}
      {state === "sent" && "Reminder sent"}
      {state === "error" && "Failed — retry"}
    </button>
  );
}

export default function AdminCooksList() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const status = searchParams.get("status") ?? "manual_review";
  const page = Number(searchParams.get("page")) || 1;

  const [data, setData] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const setStatus = (newStatus) => {
    setSearchParams({ status: newStatus, page: "1" });
  };

  const setPage = (newPage) => {
    setSearchParams({ status, page: String(newPage) });
  };

  useEffect(() => {
    setLoading(true);
    setErr("");
    api
      .get("/api/admin/cooks", {
        params: { status: status || undefined, page, limit: LIMIT },
      })
      .then((res) => setData(res.data))
      .catch((e) => setErr(e.response?.data?.error || "Failed to load cooks."))
      .finally(() => setLoading(false));
  }, [status, page]);

  const totalPages = Math.ceil((data.total || 0) / LIMIT);

  return (
    <main className="px-margin-mobile pt-stack-md pb-stack-lg animate-fade-in">
      <div className="flex items-center gap-4 mb-stack-md">
        <div
          className="shrink-0 w-14 h-14 rounded-full flex items-center justify-center"
          style={{ background: BRAND_GRADIENT }}
        >
          <Icon name="assignment_ind" className="text-white text-[26px]" />
        </div>
        <h2 className="text-headline-lg-mobile font-headline-lg-mobile text-on-surface">
          Cook Applications
        </h2>
      </div>

      <nav className="flex items-center gap-2 py-stack-sm mb-stack-md overflow-x-auto hide-scrollbar">
        {STATUS_TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setStatus(t.value)}
            className={`px-4 py-2 rounded-full font-label-sm text-label-sm whitespace-nowrap transition-all active:scale-95 ${
              status === t.value
                ? "text-white shadow-card"
                : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
            }`}
            style={
              status === t.value ? { background: BRAND_GRADIENT } : undefined
            }
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
                  ? `${c.currentStep >= 8 ? "Submitted" : `Step ${c.currentStep}/8`} · ${c.kyc.decision}`
                  : "KYC pending"}
              </span>
            </div>
            {c.status === "draft" && c.currentStep < 8 && (
              <RemindButton cookId={c._id} />
            )}
          </Card>
        ))}
      </section>

      {!loading && data.total > LIMIT && (
        <div className="flex items-center justify-between mt-stack-lg">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 rounded-full bg-surface-container-high text-on-surface-variant disabled:opacity-40 transition-opacity"
          >
            Previous
          </button>
          <span className="text-label-sm font-label-sm text-on-surface-variant">
            Page {page} of {totalPages} · {data.total} total
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 rounded-full bg-surface-container-high text-on-surface-variant disabled:opacity-40 transition-opacity"
          >
            Next
          </button>
        </div>
      )}
    </main>
  );
}
