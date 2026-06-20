import { useNavigate, Link } from "react-router-dom";
import TextField from "../components/TextField";
import Button from "../components/Button";
import Icon from "../components/Icon";

export default function Login() {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      {/* ambient background */}
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
            <p className="text-body-md text-on-surface-variant">Sign in to manage your kitchen</p>
          </header>

          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              navigate("/dashboard");
            }}
          >
            <TextField label="Phone Number" icon="call" id="phone" type="tel" placeholder="Enter 10 digit number" required />
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="password" className="text-label-lg font-label-lg text-on-surface-variant">
                  Password
                </label>
                <a href="#" className="text-secondary font-label-lg text-label-lg hover:underline">
                  Forgot Password?
                </a>
              </div>
              <TextField icon="lock" id="password" type="password" placeholder="Enter your password" required />
            </div>
            <Button full icon="arrow_forward" type="submit">
              Login
            </Button>
          </form>

          <div className="mt-8 text-center border-t border-outline-variant pt-6">
            <p className="text-body-md text-on-surface-variant">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary font-bold hover:underline">
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
