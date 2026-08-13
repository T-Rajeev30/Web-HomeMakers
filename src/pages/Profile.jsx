import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../components/Card";
import Icon from "../components/Icon";
import Button from "../components/Button";
import api from "../services/api";
import { logout } from "../store/useSession";
import { BRAND_GRADIENT } from "../lib/brand";

function Row({ label, value }) {
  return (
    <div className="py-stack-sm border-b border-outline-variant last:border-0">
      <p className="text-label-sm font-label-sm text-outline">{label}</p>
      <p className="text-body-md text-on-surface mt-0.5">{value ?? "—"}</p>
    </div>
  );
}

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [clusterEnabled, setClusterEnabled] = useState(false);
  const [minQty, setMinQty] = useState(20);
  const [discountPercent, setDiscountPercent] = useState(10);
  const [savingCluster, setSavingCluster] = useState(false);
  const [clusterMsg, setClusterMsg] = useState("");

  useEffect(() => {
    api
      .get("/api/profile/me")
      .then((res) => {
        setProfile(res.data);
        const cs = res.data.clusterSettings;
        if (cs) {
          setClusterEnabled(cs.enabled);
          setMinQty(cs.minQty);
          setDiscountPercent(cs.discountPercent);
        }
      })
      .catch((e) =>
        setErr(e.response?.data?.error || "Failed to load profile."),
      )
      .finally(() => setLoading(false));
  }, []);

  const saveClusterSettings = async () => {
    setSavingCluster(true);
    setClusterMsg("");
    try {
      await api.patch("/api/profile/cluster-settings", {
        enabled: clusterEnabled,
        minQty: Number(minQty),
        discountPercent: Number(discountPercent),
      });
      setClusterMsg("Saved.");
    } catch (e) {
      setClusterMsg(e.response?.data?.error || "Failed to save.");
    } finally {
      setSavingCluster(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <main className="px-margin-mobile pt-stack-md pb-stack-lg animate-fade-in">
      {loading && (
        <p className="text-body-md text-on-surface-variant">Loading…</p>
      )}
      {err && <p className="text-label-sm font-label-sm text-error">{err}</p>}

      {profile && (
        <>
          <Card className="p-5 mb-stack-md">
            <div className="flex items-center gap-4 mb-stack-md">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-white"
                style={{ background: BRAND_GRADIENT }}
              >
                <Icon name="storefront" className="text-[32px]" />
              </div>
              <div className="flex-1">
                <h2 className="text-headline-md font-headline-md text-on-surface">
                  {profile.personal?.name || "—"}
                </h2>
                <p className="text-label-sm font-label-sm text-on-surface-variant">
                  Kitchen Profile
                </p>
              </div>
              <button
                aria-label="Edit profile"
                onClick={() => navigate("/personal-information")}
                className="w-touch-target-min h-touch-target-min flex items-center justify-center text-primary active:scale-95"
              >
                <Icon name="edit" />
              </button>
            </div>

            <div>
              <Row label="Email" value={profile.email} />
              <Row label="Phone Number" value={profile.phone} />
              <Row label="Cuisine Type" value={profile.food?.cuisine} />
              <Row label="Food Category" value={profile.food?.category} />
              <Row
                label="Address"
                value={[
                  profile.address?.building,
                  profile.address?.locality,
                  profile.address?.pincode,
                ]
                  .filter(Boolean)
                  .join(", ")}
              />
              <Row label="Status" value={profile.status} />
            </div>
          </Card>

          <Card className="p-5 mb-stack-md">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-headline-md font-headline-md text-on-surface">
                Cluster Orders
              </h3>
              <button
                onClick={() => setClusterEnabled((v) => !v)}
                className="relative w-11 h-6 rounded-full transition-colors"
                style={{
                  background: clusterEnabled ? BRAND_GRADIENT : undefined,
                }}
              >
                {!clusterEnabled && (
                  <span className="absolute inset-0 rounded-full bg-outline-variant" />
                )}
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    clusterEnabled ? "translate-x-5" : ""
                  }`}
                />
              </button>
            </div>
            <p className="text-label-sm font-label-sm text-on-surface-variant mb-stack-md">
              Accept bulk orders (e.g. for events) at a discount once they hit
              your minimum quantity.
            </p>

            {clusterEnabled && (
              <div className="space-y-stack-sm">
                <div>
                  <label className="block mb-1 text-label-sm font-label-sm text-on-surface-variant">
                    Minimum order quantity
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={1000}
                    value={minQty}
                    onChange={(e) => setMinQty(e.target.value)}
                    className="w-full h-11 px-4 rounded-lg bg-surface-container-lowest border border-outline-variant text-body-md text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-label-sm font-label-sm text-on-surface-variant">
                    Discount for cluster orders (%)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={50}
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(e.target.value)}
                    className="w-full h-11 px-4 rounded-lg bg-surface-container-lowest border border-outline-variant text-body-md text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            )}

            {clusterMsg && (
              <p className="text-label-sm font-label-sm text-on-surface-variant mt-2">
                {clusterMsg}
              </p>
            )}

            <Button
              full
              className="mt-stack-md"
              onClick={saveClusterSettings}
              disabled={savingCluster}
            >
              {savingCluster ? "Saving..." : "Save Cluster Settings"}
            </Button>
          </Card>
        </>
      )}

      <p className="text-center text-label-sm font-label-sm text-outline mt-stack-lg">
        App Version 1.0.0
      </p>

      <button
        onClick={handleLogout}
        className="w-full mt-stack-md flex items-center justify-center gap-2 h-touch-target-min rounded-lg border border-error/30 text-error font-label-lg text-label-lg active:bg-error-container transition-colors"
      >
        <Icon name="logout" /> Log Out
      </button>
    </main>
  );
}
