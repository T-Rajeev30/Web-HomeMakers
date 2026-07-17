import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import axios from "axios";
import TopAppBar from "../components/TopAppBar";
import Button from "../components/Button";
import Icon from "../components/Icon";
import { login } from "../store/useSession";
import { initializeMsg91, sendOtp, verifyOtp } from "../services/msg91";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://zingro.in/auth-api";

export default function OtpVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  const { name, phone } = location.state || {};
  const [otpSent, setOtpSent] = useState(false);

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [seconds, setSeconds] = useState(30);
  const [sending, setSending] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const refs = useRef([]);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  useEffect(() => {
    if (!phone) return;
    initializeMsg91()
      .then(() => sendOtp(phone))
      .then(() => setOtpSent(true))
      .catch((err) => setError(err.message || "Failed to send OTP"))
      .finally(() => setSending(false));
  }, [phone]);

  if (!phone) {
    return <Navigate to="/signup" replace />;
  }

  const handleChange = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    setError("");
    if (val && i < 5) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) refs.current[i - 1]?.focus();
  };

  const handleResend = async () => {
    setSeconds(30);
    setError("");
    try {
      await sendOtp(phone);
      setOtpSent(true);
    } catch (err) {
      setOtpSent(false);
      setError(err.message || "Failed to resend OTP");
    }
  };

  const verify = async () => {
    const code = otp.join("");
    if (code.length < 6) {
      setError("Please enter the complete 6-digit OTP.");
      return;
    }

    setVerifying(true);
    setError("");
    try {
      const result = await verifyOtp(code);

      const response = await axios.post(
        `${API_BASE_URL}/api/v1/auth/verify-otp`,
        { accessToken: result.message, name, role: "homemaker" },
      );

      const { user, accessToken, refreshToken } = response.data.data;
      login({ user, accessToken, refreshToken });
      navigate("/personal-information");
    } catch (err) {
      setError(
        err.response?.data?.message || "Incorrect OTP, please try again.",
      );
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopAppBar showBack />
      <main className="w-full max-w-md mx-auto px-margin-mobile mt-stack-lg flex-grow flex flex-col">
        <div className="mb-stack-lg">
          <h1 className="text-headline-lg-mobile font-headline-lg-mobile text-on-surface mb-stack-sm">
            Verify Phone Number
          </h1>
          <p className="text-body-md text-on-surface-variant">
            {sending ? "Sending code to" : "Enter the 6-digit code sent to"} +91{" "}
            {phone}
          </p>
        </div>

        <div className="flex flex-col gap-stack-lg">
          <div className="flex justify-between gap-gutter">
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (refs.current[i] = el)}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                inputMode="numeric"
                maxLength={1}
                disabled={sending}
                className={`w-12 h-16 text-center text-headline-lg font-headline-lg rounded-xl bg-surface-container-lowest border-2 outline-none transition-all ${
                  error
                    ? "border-error"
                    : digit
                      ? "border-primary"
                      : "border-outline-variant"
                } focus:border-primary`}
              />
            ))}
          </div>

          {error && (
            <div className="flex items-center gap-2 text-error px-4 py-3 bg-error-container rounded-lg">
              <Icon name="error" className="text-base" />
              <span className="text-label-lg font-label-lg">{error}</span>
            </div>
          )}

          <div className="flex items-center justify-center gap-2">
            <p className="text-body-md text-on-surface-variant">
              Didn't receive code?
            </p>
            <button
              disabled={seconds > 0}
              onClick={handleResend}
              className="text-primary font-label-lg hover:underline disabled:text-outline disabled:no-underline"
            >
              {seconds > 0 ? `Resend OTP (${seconds}s)` : "Resend OTP"}
            </button>
          </div>
        </div>

        <div className="flex-grow" />
        <div className="py-stack-lg">
          <Button
            full
            icon="arrow_forward"
            onClick={verify}
            disabled={verifying || sending || !otpSent}
          >
            {verifying ? "Verifying..." : "Verify & Continue"}
          </Button>
        </div>
      </main>
    </div>
  );
}
