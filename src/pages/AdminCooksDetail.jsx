import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TopAppBar from "../components/TopAppBar";
import { Card, Chip } from "../components/Card";
import Button from "../components/Button";
import Icon from "../components/Icon";
import api from "../services/api";
import { BRAND_GRADIENT } from "../lib/brand";

const chipTone = {
  draft: "neutral",
  verification_pending: "pending",
  manual_review: "pending",
  approved: "success",
  rejected: "error",
};

// Digio's real terminal-success status is "approved" — there is no
// "verified" value in their API. Checking both for backward compatibility
// with any records written before this was discovered.
const AADHAAR_SUCCESS_STATUSES = ["approved", "verified"];
const AADHAAR_TERMINAL_STATUSES = [
  "approved",
  "verified",
  "rejected",
  "failed",
  "expired",
];

function Row({ label, value }) {
  return (
    <div className="py-stack-sm border-b border-outline-variant last:border-0">
      <p className="text-label-sm font-label-sm text-outline">{label}</p>
      <p className="text-body-md text-on-surface mt-0.5">{value ?? "—"}</p>
    </div>
  );
}

/**
 * One KYC check, with the actual detail behind the pass/fail — not just
 * a bare checkmark. `detail` is a label→value list of the real fields
 * that produced the verdict, so an admin can see *why* something failed
 * without leaving this screen.
 */
function VerdictCard({ label, ok, unknown, detail = [] }) {
  const state = unknown ? "unknown" : ok ? "ok" : "fail";
  const styles = {
    ok: { icon: "check_circle", color: "#0fb59b", bg: "#0fb59b14" },
    fail: {
      icon: "cancel",
      color: "var(--error, #dc2626)",
      bg: "var(--error-container, #fde3e3)",
    },
    unknown: {
      icon: "help",
      color: "var(--on-surface-variant, #6b5c45)",
      bg: "var(--surface-container-high, #f0eae0)",
    },
  }[state];

  return (
    <div className="rounded-xl p-3.5" style={{ backgroundColor: styles.bg }}>
      <div className="flex items-center gap-2 mb-1.5">
        <Icon
          name={styles.icon}
          fill
          className="text-[18px]"
          style={{ color: styles.color }}
        />
        <span className="text-label-lg font-label-lg text-on-surface">
          {label}
        </span>
      </div>
      {detail.length > 0 ? (
        <div className="pl-[26px] flex flex-col gap-0.5">
          {detail.map(([k, v]) => (
            <p
              key={k}
              className="text-label-sm font-label-sm text-on-surface-variant"
            >
              <span className="opacity-70">{k}:</span> {v ?? "—"}
            </p>
          ))}
        </div>
      ) : (
        unknown && (
          <p className="pl-[26px] text-label-sm font-label-sm text-on-surface-variant">
            Step not completed yet
          </p>
        )
      )}
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

  const aadhaarStatus = cook.aadhaar?.status;
  const aadhaarOk = AADHAAR_SUCCESS_STATUSES.includes(aadhaarStatus);
  const aadhaarUnknown =
    !aadhaarStatus || !AADHAAR_TERMINAL_STATUSES.includes(aadhaarStatus);

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <TopAppBar showBack title="Application Review" right={null} />
      <main className="flex-1 px-margin-mobile pt-stack-md pb-32 animate-fade-in">
        <div className="flex items-center gap-4 mb-stack-md">
          <div
            className="shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
            style={{ background: BRAND_GRADIENT }}
          >
            <Icon name="fact_check" className="text-white text-[22px]" />
          </div>
          <div className="flex-1 flex justify-between items-center">
            <h2 className="text-headline-lg-mobile font-headline-lg-mobile text-on-surface">
              {cook.personal?.name || "—"}
            </h2>
            <Chip tone={chipTone[cook.status] || "neutral"}>{cook.status}</Chip>
          </div>
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
        </Card>

        <Card className="p-4 mb-stack-lg">
          <h3 className="text-label-lg font-label-lg text-on-surface mb-3">
            KYC Verdicts
          </h3>
          <div className="flex flex-col gap-2.5">
            <VerdictCard
              label="PAN"
              ok={
                cook.tax?.verified === true && cook.tax?.name_matched === true
              }
              unknown={cook.tax?.verified == null}
              detail={
                cook.tax?.masked
                  ? [
                      ["PAN", cook.tax.masked],
                      ["Name match", cook.tax.name_matched ? "Yes" : "No"],
                      ["DOB match", cook.tax.dob_matched ? "Yes" : "No"],
                      ...(cook.tax.status ? [["Status", cook.tax.status]] : []),
                      ...(cook.tax.remarks
                        ? [["Remarks", cook.tax.remarks]]
                        : []),
                    ]
                  : []
              }
            />

            <VerdictCard
              label="Bank Account"
              ok={cook.bank?.verified === true}
              unknown={cook.bank?.verified == null}
              detail={
                cook.bank?.masked
                  ? [
                      ["Account", cook.bank.masked],
                      ["IFSC", cook.bank.ifsc],
                      [
                        "Name match",
                        typeof cook.bank.fuzzy_match_score === "number"
                          ? `${cook.bank.fuzzy_match_score}%`
                          : "—",
                      ],
                      ...(cook.bank.name_with_bank
                        ? [["Name on bank record", cook.bank.name_with_bank]]
                        : []),
                      ...(cook.bank.error_msg
                        ? [["Error", cook.bank.error_msg]]
                        : []),
                    ]
                  : []
              }
            />

            <VerdictCard
              label="FSSAI License"
              ok={
                cook.fssai?.active === true &&
                cook.fssai?.manual_review_required === false
              }
              unknown={cook.fssai?.active == null}
              detail={
                cook.fssai?.license_masked
                  ? [
                      ["License", cook.fssai.license_masked],
                      ["Registered name", cook.fssai.registered_name],
                      ["Expiry", cook.fssai.expiry],
                      ...(cook.fssai.status_desc
                        ? [["Status", cook.fssai.status_desc]]
                        : []),
                      [
                        "Needs manual review",
                        cook.fssai.manual_review_required ? "Yes" : "No",
                      ],
                    ]
                  : []
              }
            />

            <VerdictCard
              label="Aadhaar (Digio)"
              ok={aadhaarOk}
              unknown={aadhaarUnknown}
              detail={
                cook.aadhaar?.request_id
                  ? [
                      ["Status", aadhaarStatus || "—"],
                      [
                        "Last updated",
                        cook.aadhaar.updated_at
                          ? new Date(cook.aadhaar.updated_at).toLocaleString(
                              "en-IN",
                            )
                          : "—",
                      ],
                    ]
                  : []
              }
            />
          </div>

          {cook.kycVerdict ? (
            <div className="mt-4 pt-4 border-t border-outline-variant flex items-center justify-between">
              <span className="text-label-sm font-label-sm text-on-surface-variant">
                Computed verdict:{" "}
                <strong className="text-on-surface">
                  {cook.kycVerdict.decision}
                </strong>
                {" · "}score {(cook.kycVerdict.score * 100).toFixed(1)}%
              </span>
            </div>
          ) : (
            cook.kyc?.name_match_score != null && (
              <p className="text-label-sm font-label-sm text-on-surface-variant mt-3">
                Name match score: {(cook.kyc.name_match_score * 100).toFixed(1)}
                %
              </p>
            )
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
