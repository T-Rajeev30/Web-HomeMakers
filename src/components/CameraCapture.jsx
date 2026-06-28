import { useEffect, useRef, useState } from "react";
import Button from "./Button";
import Icon from "./Icon";

/**
 * Live camera modal. Works on desktop + mobile via getUserMedia.
 * Calls onCapture(File) with a JPEG; onClose() to dismiss.
 */
export default function CameraCapture({
  onCapture,
  onClose,
  title = "Take photo",
}) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [facing, setFacing] = useState("environment"); // back camera by default
  const [err, setErr] = useState("");
  const [ready, setReady] = useState(false);

  const stop = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  };

  const start = async (mode) => {
    setErr("");
    setReady(false);
    stop();
    // getUserMedia only exists on a secure context (https or localhost).
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setErr(
        window.isSecureContext
          ? "This browser does not support camera access. Use the Upload button instead."
          : "Camera needs a secure connection (https or localhost). You're on " +
              window.location.protocol +
              "//" +
              window.location.host +
              ". Open the site via localhost or https, or use Upload.",
      );
      return;
    }
    const tryStream = async (constraints) => {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // play() can reject with AbortError if the element re-renders mid-load.
        // That's harmless — the stream is attached and will show. Ignore it.
        try {
          await videoRef.current.play();
        } catch (playErr) {
          if (playErr.name !== "AbortError") throw playErr;
        }
        setReady(true);
      }
    };

    try {
      await tryStream({ video: { facingMode: mode }, audio: false });
    } catch (e) {
      // facingMode unsupported (most laptops) OR a transient abort → retry with any camera.
      if (
        ["OverconstrainedError", "NotFoundError", "AbortError"].includes(e.name)
      ) {
        try {
          await tryStream({ video: true, audio: false });
        } catch (e2) {
          setErr(camError(e2));
        }
      } else {
        setErr(camError(e));
      }
    }
  };

  useEffect(() => {
    start(facing);
    return stop; // cleanup on unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facing]);

  const snap = () => {
    const v = videoRef.current;
    if (!v || !v.videoWidth) return;
    const canvas = document.createElement("canvas");
    canvas.width = v.videoWidth;
    canvas.height = v.videoHeight;
    canvas.getContext("2d").drawImage(v, 0, 0);
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const file = new File([blob], `photo-${Date.now()}.jpg`, {
          type: "image/jpeg",
        });
        stop();
        onCapture(file);
      },
      "image/jpeg",
      0.9,
    );
  };

  const close = () => {
    stop();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 text-white">
        <span className="font-label-lg text-label-lg">{title}</span>
        <button onClick={close} aria-label="Close camera">
          <Icon name="close" className="text-[24px]" />
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center overflow-hidden">
        {err ? (
          <div className="text-center px-6 text-white/90">
            <Icon name="videocam_off" className="text-[40px] mb-2" />
            <p className="text-body-md">{err}</p>
          </div>
        ) : (
          <video
            ref={videoRef}
            playsInline
            muted
            className="max-h-full max-w-full object-contain"
          />
        )}
      </div>

      {!err && (
        <div className="flex items-center justify-center gap-8 py-6">
          <button
            onClick={() =>
              setFacing((f) => (f === "environment" ? "user" : "environment"))
            }
            className="text-white active:scale-95"
            aria-label="Switch camera"
          >
            <Icon name="cameraswitch" className="text-[28px]" />
          </button>
          <button
            onClick={snap}
            disabled={!ready}
            className="w-16 h-16 rounded-full bg-white border-4 border-white/40 active:scale-95 disabled:opacity-40"
            aria-label="Capture"
          />
          <span className="w-7" />
        </div>
      )}

      {err && (
        <div className="px-6 pb-6 flex gap-2">
          <Button
            full
            variant="outline"
            icon="refresh"
            iconRight={false}
            onClick={() => start(facing)}
          >
            Retry
          </Button>
          <Button full variant="outline" onClick={close}>
            Close
          </Button>
        </div>
      )}
    </div>
  );
}

function camError(e) {
  if (e.name === "NotAllowedError")
    return "Camera permission denied. Allow camera access in your browser and retry.";
  if (e.name === "NotFoundError" || e.name === "DevicesNotFoundError")
    return "No camera found on this device.";
  if (e.name === "NotReadableError" || e.name === "AbortError")
    return "Camera couldn't start — it may be in use by another app (Zoom, Teams, another tab). Close those, then Retry.";
  return (
    "Unable to access the camera (" +
    (e.name || "unknown") +
    "). Check browser permissions or use Upload."
  );
}
