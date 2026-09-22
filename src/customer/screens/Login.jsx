import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { post } from "../api/client";
import { EP } from "../api/endpoints";
import { saveSession } from "../auth/session";

export default function Login() {
  const nav = useNavigate();
  const loc = useLocation();
  const [step, setStep] = useState("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const sendOtp = async () => {
    setErr("");
    setBusy(true);
    try {
      await post(EP.sendOtp, { phone });
      setStep("otp");
    } catch (e) {
      setErr(e.body?.message || e.message);
    } finally {
      setBusy(false);
    }
  };

  const verify = async () => {
    setErr("");
    setBusy(true);
    try {
      const data = await post(EP.verifyOtp, { phone, otp });
      saveSession(data);
      nav(loc.state?.from?.pathname || "/customer", { replace: true });
    } catch (e) {
      setErr(e.body?.message || e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="zc-auth">
      <h1>Sign in</h1>
      {step === "phone" ? (
        <>
          <input
            className="zc-input"
            inputMode="numeric"
            maxLength={10}
            placeholder="10-digit phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
          />
          <button
            className="zc-btn"
            disabled={busy || phone.length !== 10}
            onClick={sendOtp}
          >
            {busy ? "Sending…" : "Get OTP"}
          </button>
        </>
      ) : (
        <>
          <input
            className="zc-input"
            inputMode="numeric"
            maxLength={6}
            placeholder="OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          />
          <button
            className="zc-btn"
            disabled={busy || otp.length < 4}
            onClick={verify}
          >
            {busy ? "Verifying…" : "Verify"}
          </button>
          <button className="zc-link" onClick={() => setStep("phone")}>
            Change number
          </button>
        </>
      )}
      {err && <p className="zc-error">{err}</p>}
    </div>
  );
}
