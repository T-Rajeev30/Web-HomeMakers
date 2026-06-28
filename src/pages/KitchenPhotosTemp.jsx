import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OnboardingLayout from "../components/OnboardingLayout";
import { Card } from "../components/Card";
import Button from "../components/Button";
import Icon from "../components/Icon";
import CameraCapture from "../components/CameraCapture";
import { STEPS } from "../data/onboarding";
import { saveStep } from "../store/useOnboarding";

function PhotoTile({ label, photo, onCamera, onFile }) {
  return (
    <div>
      <p className="text-label-lg font-label-lg text-on-surface-variant mb-2">
        {label}
      </p>
      <div className="aspect-video rounded-xl border-2 border-dashed border-outline-variant bg-surface-container-lowest flex flex-col items-center justify-center overflow-hidden">
        {photo ? (
          <img
            src={photo.url}
            alt={label}
            className="w-full h-full object-cover"
          />
        ) : (
          <Icon name="photo_camera" className="text-outline text-[32px]" />
        )}
      </div>
      <div className="flex gap-2 mt-2">
        <Button
          variant="outline"
          icon="photo_camera"
          iconRight={false}
          onClick={onCamera}
          className="flex-1 h-10 text-label-sm"
        >
          {photo ? "Retake" : "Open camera"}
        </Button>
        <label className="flex-1">
          <span
            className="inline-flex w-full items-center justify-center gap-2 h-10 px-4 rounded-lg
            bg-surface-container-lowest text-on-surface border border-outline-variant
            text-label-sm font-label-lg cursor-pointer active:scale-[0.98] transition-all"
          >
            <Icon name="upload" className="text-[18px]" />
            Upload
          </span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files[0] && onFile(e.target.files[0])}
          />
        </label>
      </div>
    </div>
  );
}

// location: "loading" | "ok" | "denied"
export default function KitchenPhotos() {
  const navigate = useNavigate();
  const s = STEPS.photos;
  const [gps, setGps] = useState(null);
  const [locState, setLocState] = useState("loading");
  const [kitchen, setKitchen] = useState(null);
  const [profile, setProfile] = useState(null);
  const [camFor, setCamFor] = useState(null); // "kitchen" | "profile" | null
  const [err, setErr] = useState("");

  const requestLocation = () => {
    setLocState("loading");
    if (!navigator.geolocation) return setLocState("denied");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGps({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocState("ok");
      },
      () => setLocState("denied"),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  useEffect(() => {
    requestLocation();
  }, []);

  const setPhoto = (which) => (file) => {
    setErr("");
    const photo = { url: URL.createObjectURL(file), file };
    which === "kitchen" ? setKitchen(photo) : setProfile(photo);
  };

  const handleCapture = (file) => {
    setPhoto(camFor)(file);
    setCamFor(null);
  };

  const submit = () => {
    if (locState !== "ok" || !gps)
      return setErr(
        "Location is required. Tap 'Enable location' and allow access.",
      );
    if (!kitchen || !profile)
      return setErr("Please add both a kitchen photo and a profile picture.");
    saveStep("photos", {
      gps,
      kitchenName: kitchen.file.name,
      profileName: profile.file.name,
    });
    navigate(s.next);
  };

  return (
    <OnboardingLayout step={s.step} stepLabel={s.label}>
      <Card className="p-6 space-y-stack-lg">
        <div>
          <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-2">
            Kitchen photos
          </h2>
          <p className="text-body-md text-on-surface-variant">
            Use the live camera on any device, or upload an image. Location is
            required for verification.
          </p>
        </div>

        {locState === "loading" && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-surface-container-low text-on-surface-variant">
            <Icon name="my_location" className="text-[20px]" />
            <span className="text-label-sm font-label-sm">
              Getting your location…
            </span>
          </div>
        )}
        {locState === "ok" && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-primary-fixed text-on-primary-fixed">
            <Icon name="location_on" className="text-[20px]" />
            <span className="text-label-sm font-label-sm">
              Location captured · {gps.lat.toFixed(4)}, {gps.lng.toFixed(4)}
            </span>
          </div>
        )}
        {locState === "denied" && (
          <div className="flex items-center justify-between gap-2 p-3 rounded-lg bg-error-container text-on-error-container">
            <span className="text-label-sm font-label-sm">
              Location blocked or unavailable.
            </span>
            <button
              onClick={requestLocation}
              className="underline font-label-sm text-label-sm"
            >
              Enable location
            </button>
          </div>
        )}

        <PhotoTile
          label="Kitchen Photo"
          photo={kitchen}
          onCamera={() => setCamFor("kitchen")}
          onFile={setPhoto("kitchen")}
        />
        <PhotoTile
          label="Profile Picture"
          photo={profile}
          onCamera={() => setCamFor("profile")}
          onFile={setPhoto("profile")}
        />

        {err && <p className="text-label-sm font-label-sm text-error">{err}</p>}
        <Button full icon="arrow_forward" onClick={submit}>
          Continue..
        </Button>
      </Card>

      {camFor && (
        <CameraCapture
          title={
            camFor === "kitchen" ? "Capture kitchen" : "Capture profile photo"
          }
          onCapture={handleCapture}
          onClose={() => setCamFor(null)}
        />
      )}
    </OnboardingLayout>
  );
}
