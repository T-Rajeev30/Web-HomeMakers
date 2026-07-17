import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../components/Card";
import Icon from "../components/Icon";
import api from "../services/api";
import { logout } from "../store/useSession";

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

  useEffect(() => {
    api
      .get("/api/profile/me")
      .then((res) => setProfile(res.data))
      .catch((e) =>
        setErr(e.response?.data?.error || "Failed to load profile."),
      )
      .finally(() => setLoading(false));
  }, []);

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
        <Card className="p-5">
          <div className="flex items-center gap-4 mb-stack-md">
            <div className="w-16 h-16 rounded-full bg-surface-container-highest flex items-center justify-center text-primary">
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
