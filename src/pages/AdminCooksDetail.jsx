import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TopAppBar from "../components/TopAppBar";
import { Card, Chip } from "../components/Card";
import Button from "../components/Button";
import Icon from "../components/Icon";
import api from "../services/api";

const chipTone = {
  draft: "neutral",
  verification_pending: "pending",
  manual_review: "pending",
  approved: "success",
  rejected: "neutral",
};

function Row({ label, value }) {
  return (
    <div className="py-stack-sm border-b border-outline-variant last:border-0">
      <p className="text-label-sm font-label-sm text-outline">{label}</p>
      <p className="text-body-md text-on-surface mt-0.5">{value ?? "—"}</p>
    </div>
  );
}

function Verdict({ label, ok }) {
  return (
    <div className="flex items-center gap-2">
      <Icon
        name={ok ? "check_circle" : "cancel"}
        fill
        className={`text-[18px] ${ok ? "text-primary" : "text-error"}`}
      />
      <span className="text-label-sm font-label-sm text-on-surface-variant">
        {label}
      </span>
    </div>
  );
}

export default function AdminCookDetail() {
  const { id } = useParams();
  const [cook, setCook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [note, setNote] = useState("");
  const [deciding, setDeciding] = useState(false);

  const load = () => {
    setLoading(true);
    api
      .get(`/api/admin/cooks/${id}`)
      .then((res) => setCook(res.data))
      .catch((e) => setErr(e.response?.data?.error || "Failed to load cook."))
      .finally(() => setLoading(false));
  };

  useEffect(load, [id]);

  const decide = async (decision) => {
    setDeciding(true);
    setErr("");
    try {
      await api.post(`/api/admin/cooks/${id}/decision`, { decision, note });
      load();
    } catch (e) {
      setErr(e.response?.data?.error || "Failed to submit decision.");
    } finally {
      setDeciding(false);
    }
  };

  if (loading)
    return <p className="p-6 text-body-md text-on-surface-variant">Loading…</p>;
  if (err && !cook) return <p className="p-6 text-body-md text-error">{err}</p>;
  if (!cook) return null;

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <TopAppBar showBack title="Application Review" right={null} />
      <main className="flex-1 px-margin-mobile pt-stack-md pb-32 animate-fade-in">
        <div className="flex justify-between items-center mb-stack-md">
          <h2 className="text-headline-lg-mobile font-headline-lg-mobile text-on-surface">
            {cook.personal?.name || "—"}
          </h2>
          <Chip tone={chipTone[cook.status] || "neutral"}>{cook.status}</Chip>
        </div>

        <div className="grid grid-cols-2 gap-stack-md mb-stack-lg">
          {cook.photoUrls?.kitchen && (
            <img
              src={cook.photoUrls.kitchen}
              alt="Kitchen"
              className="w-full aspect-video object-cover rounded-xl border border-outline-variant"
            />
          )}
          {cook.photoUrls?.profile && (
            <img
              src={cook.photoUrls.profile}
              alt="Profile"
              className="w-full aspect-video object-cover rounded-xl border border-outline-variant"
            />
          )}
        </div>

        <Card className="p-4 mb-stack-md">
          <Row label="Phone" value={cook.phone} />
          <Row label="Email" value={cook.email} />
          <Row
            label="Address"
            value={[
              cook.address?.building,
              cook.address?.locality,
              cook.address?.pincode,
            ]
              .filter(Boolean)
              .join(", ")}
          />
          <Row
            label="Cuisine"
            value={[cook.food?.cuisine, cook.food?.category]
              .filter(Boolean)
              .join(" · ")}
          />
          <Row label="PAN (masked)" value={cook.tax?.masked} />
          <Row label="Bank A/C (masked)" value={cook.bank?.masked} />
          <Row label="FSSAI (masked)" value={cook.fssai?.license_masked} />
        </Card>

        <Card className="p-4 mb-stack-lg">
          <h3 className="text-label-lg font-label-lg text-on-surface mb-3">
            KYC Verdicts
          </h3>
          <div className="space-y-2">
            <Verdict label="PAN verified" ok={cook.tax?.verified} />
            <Verdict label="Bank penny-drop OK" ok={cook.bank?.penny_drop_ok} />
            <Verdict label="FSSAI active" ok={cook.fssai?.active} />
          </div>
          {cook.kyc?.name_match_score != null && (
            <p className="text-label-sm font-label-sm text-on-surface-variant mt-3">
              Name match score: {(cook.kyc.name_match_score * 100).toFixed(1)}%
            </p>
          )}
        </Card>

        {cook.status === "manual_review" ? (
          <div className="space-y-stack-md">
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Note (optional)"
              rows={3}
              className="w-full px-4 py-3 rounded-lg bg-surface-container-lowest border border-outline-variant text-body-md text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
            />
            {err && (
              <p className="text-label-sm font-label-sm text-error">{err}</p>
            )}
            <div className="flex gap-stack-sm">
              <Button
                full
                variant="outline"
                icon="cancel"
                iconRight={false}
                disabled={deciding}
                onClick={() => decide("rejected")}
                className="border-error/40 text-error"
              >
                Reject
              </Button>
              <Button
                full
                icon="check_circle"
                disabled={deciding}
                onClick={() => decide("approved")}
              >
                Approve
              </Button>
            </div>
          </div>
        ) : (
          <Card className="p-4">
            <p className="text-label-sm font-label-sm text-on-surface-variant">
              Decision: {cook.kyc?.decision || cook.status}
              {cook.kyc?.note ? ` — ${cook.kyc.note}` : ""}
            </p>
          </Card>
        )}
      </main>
    </div>
  );
}
