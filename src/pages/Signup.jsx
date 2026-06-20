import { useNavigate, Link } from "react-router-dom";
import TopAppBar from "../components/TopAppBar";
import TextField from "../components/TextField";
import Button from "../components/Button";

export default function Signup() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopAppBar logo right={null} />
      <main className="w-full max-w-md mx-auto px-margin-mobile py-stack-lg flex-1 flex flex-col">
        <div className="relative w-full h-40 mb-stack-lg rounded-xl overflow-hidden bg-primary-fixed/40 flex items-center justify-center">
          <span className="material-symbols-outlined text-primary text-[64px]">storefront</span>
        </div>

        <div className="mb-stack-lg">
          <h2 className="text-headline-lg-mobile font-headline-lg-mobile text-on-surface mb-2">
            Create Your Account
          </h2>
          <p className="text-body-md text-on-surface-variant">
            Start your food business journey with Zingro
          </p>
        </div>

        <form
          className="space-y-gutter"
          onSubmit={(e) => {
            e.preventDefault();
            navigate("/otp");
          }}
        >
          <TextField label="Full Name" icon="person" id="name" placeholder="e.g. Sunita Sharma" required />
          <TextField
            label="Phone Number"
            icon="call"
            prefix="+91"
            id="phone"
            type="tel"
            placeholder="10-digit mobile number"
            required
          />
          <Button full icon="arrow_forward" type="submit" className="mt-stack-md">
            Get OTP
          </Button>
        </form>

        <p className="mt-stack-lg text-center text-body-md text-on-surface-variant">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-bold hover:underline">
            Login
          </Link>
        </p>

        <div className="flex items-center my-stack-lg">
          <div className="flex-1 border-t border-outline-variant" />
          <span className="px-4 text-label-sm font-label-sm text-outline uppercase tracking-wider">
            or join with
          </span>
          <div className="flex-1 border-t border-outline-variant" />
        </div>

        <div className="grid grid-cols-2 gap-gutter">
          <Button variant="outline">Google</Button>
          <Button variant="outline">Facebook</Button>
        </div>
      </main>
    </div>
  );
}
