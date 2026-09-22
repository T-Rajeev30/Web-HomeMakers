import { Navigate, useLocation } from "react-router-dom";
import { claims, isAdmin, clearSession } from "./session";

export default function AdminGate({ children }) {
  const loc = useLocation();
  const c = claims();

  if (!c || c._expired)
    return <Navigate to="/customer/login" state={{ from: loc }} replace />;

  if (!isAdmin(c)) {
    return (
      <div className="zc-locked">
        <span className="material-symbols-rounded">lock</span>
        <h1>Restricted preview</h1>
        <p>This build is limited to Zingro admin accounts.</p>
        <button
          className="zc-btn"
          onClick={() => {
            clearSession();
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
