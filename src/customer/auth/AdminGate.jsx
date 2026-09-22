import { Navigate, useLocation } from "react-router-dom";
import { useClaims, hasAdmin, clearToken } from "./session";

export default function AdminGate({ children }) {
  const loc = useLocation();
  const claims = useClaims();

  if (!claims)
    return <Navigate to="/customer/login" state={{ from: loc }} replace />;

  if (!hasAdmin(claims)) {
    return (
      <div className="zc-locked">
        <span className="material-symbols-rounded">lock</span>
        <h1>Restricted preview</h1>
        <p>This build is limited to Zingro admin accounts.</p>
        <button
          onClick={() => {
            clearToken();
            window.location.replace("/customer/login");
          }}
        >
          Sign in with another account
        </button>
      </div>
    );
  }
  return children;
}
