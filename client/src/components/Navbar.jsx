import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const out = () => { logout(); nav("/"); };

  return (
    <nav style={{ borderBottom: "1px solid var(--border)", background: "rgba(15,23,42,.8)", backdropFilter: "blur(8px)", position: "sticky", top: 0, zIndex: 50 }}>
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px" }}>
        <Link to="/" style={{ fontWeight: 800, fontSize: 20 }}>Job<span style={{ color: "var(--accent2)" }}>Hub</span></Link>
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <Link to="/jobs">Jobs</Link>
          {!user && <><Link to="/login">Login</Link><Link to="/register" className="btn">Sign up</Link></>}
          {user?.role === "user" && <Link to="/my-applications">My Applications</Link>}
          {user?.role === "company" && <Link to="/company">Dashboard</Link>}
          {user?.role === "admin" && <Link to="/admin">Admin</Link>}
          {user && <button className="btn secondary" onClick={out}>Logout</button>}
        </div>
      </div>
    </nav>
  );
}
