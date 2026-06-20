import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import TopAppBar from "../components/TopAppBar";
import Button from "../components/Button";
import Icon from "../components/Icon";

export default function OtpVerification() {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [error, setError] = useState(false);
  const [seconds, setSeconds] = useState(30);
  const refs = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const handleChange = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    setError(false);
    if (val && i < 3) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) refs.current[i - 1]?.focus();
  };

  const verify = () => {
    if (otp.join("").length < 4) {
      setError(true);
      return;
    }
    navigate("/personal-information");
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
            Enter the 4-digit code sent to +91 XXXXX XXXXX
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
                className={`w-16 h-16 text-center text-headline-lg font-headline-lg rounded-xl bg-surface-container-lowest border-2 outline-none transition-all ${
                  error ? "border-error" : digit ? "border-primary" : "border-outline-variant"
                } focus:border-primary`}
              />
            ))}
          </div>

          {error && (
            <div className="flex items-center gap-2 text-error px-4 py-3 bg-error-container rounded-lg">
              <Icon name="error" className="text-base" />
              <span className="text-label-lg font-label-lg">Incorrect OTP, please try again.</span>
            </div>
          )}

          <div className="flex items-center justify-center gap-2">
            <p className="text-body-md text-on-surface-variant">Didn't receive code?</p>
            <button
              disabled={seconds > 0}
              onClick={() => setSeconds(30)}
              className="text-primary font-label-lg hover:underline disabled:text-outline disabled:no-underline"
            >
              {seconds > 0 ? `Resend OTP (${seconds}s)` : "Resend OTP"}
            </button>
          </div>
        </div>

        <div className="mt-12 flex justify-center opacity-10">
          <div className="w-44 h-44 rounded-full bg-primary-container flex items-center justify-center">
            <Icon name="shield_person" className="text-[96px] text-on-primary-container" />
          </div>
        </div>

        <div className="flex-grow" />
        <div className="py-stack-lg">
          <Button full icon="arrow_forward" onClick={verify}>
            Verify &amp; Continue
          </Button>
        </div>
      </main>
    </div>
  );
}
