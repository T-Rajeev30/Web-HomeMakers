import { useNavigate, useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import TextField from "../components/TextField";
import Button from "../components/Button";
import Icon from "../components/Icon";
import { login } from "../store/useSession";
import { initializeMsg91, sendOtp, verifyOtp } from "../services/msg91";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://zingro.in/auth-api";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const from = location.state?.from || "/dashboard";

  useEffect(() => {
    initializeMsg91().catch((err) =>
      setError(err.message || "Failed to initialize verification."),
    );
  }, []);

  const handleSendOtp = async () => {
    setLoading(true);
    setError("");
    try {
      await sendOtp(phone);
      setOtpSent(true);
    } catch (err) {
      setError(err.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await verifyOtp(otp);
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/auth/signup/homemaker`,
        { accessToken: result.message },
      );
      login(response.data.data);
      navigate(from);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Incorrect OTP, please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!otpSent) {
      handleSendOtp();
    } else {
      handleVerifyOtp();
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      <div className="fixed inset-0 -z-10 opacity-30 pointer-events-none">
        <div className="absolute -top-[10%] -right-[5%] w-[400px] h-[400px] bg-primary-fixed-dim rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] -left-[5%] w-[300px] h-[300px] bg-secondary-container rounded-full blur-[120px]" />
      </div>

      <main className="flex-grow flex flex-col items-center justify-center px-margin-mobile py-stack-lg w-full max-w-md mx-auto">
        <div className="mb-10 text-center">
          <span className="font-headline-lg text-[40px] font-extrabold text-primary tracking-tight">
            ZINGRO
          </span>
        </div>

        <div className="w-full bg-surface-container-lowest rounded-xl p-8 border border-outline-variant shadow-card">
          <header className="mb-8">
            <h2 className="text-headline-lg-mobile font-headline-lg-mobile text-on-surface mb-2">
              Welcome Back
            </h2>
            <p className="text-body-md text-on-surface-variant">
              Sign in to manage your kitchen
            </p>
          </header>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <TextField
              label="Phone Number"
              icon="call"
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter 10 digit number"
              disabled={otpSent}
              required
            />
            {otpSent && (
              <TextField
                label="OTP"
                icon="password"
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                required
              />
            )}

            {error && (
              <div className="flex items-center gap-2 text-error px-4 py-3 bg-error-container rounded-lg">
                <Icon name="error" className="text-base" />
                <span className="text-label-lg font-label-lg">{error}</span>
              </div>
            )}

            <Button
              full
              icon={otpSent ? "verified_user" : "sms"}
              type="submit"
              disabled={loading}
            >
              {loading ? "Please wait..." : otpSent ? "Verify OTP" : "Send OTP"}
            </Button>
          </form>

          <div className="mt-8 text-center border-t border-outline-variant pt-6">
            <p className="text-body-md text-on-surface-variant">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-primary font-bold hover:underline"
              >
                Signup
              </Link>
            </p>
          </div>
        </div>

        <footer className="mt-10 flex flex-col items-center gap-5">
          <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-outline-variant text-on-surface-variant hover:bg-surface-container-high transition-colors">
            <Icon name="language" className="text-[20px]" />
            <span className="font-label-lg text-label-lg">English</span>
            <Icon name="expand_more" className="text-[18px]" />
          </button>
          <p className="text-label-sm text-outline uppercase tracking-widest">
            Empowering Home Chefs Everywhere
          </p>
        </footer>
      </main>
    </div>
  );
}
