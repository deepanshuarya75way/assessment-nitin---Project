import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const out = () => { logout(); nav("/"); };

  return (
    <nav className="nav">
      <div className="container nav-in" style={{ padding: "14px 28px" }}>
        <Link to="/" className="logo">Job<span style={{ color: "var(--accent2)" }}>Hub</span></Link>
        <div className="nav-links">
          <NavLink to="/jobs">Jobs</NavLink>
          <NavLink to="/contact">Contact Us</NavLink>
          {!user && <><NavLink to="/login">Login</NavLink><Link to="/register" className="btn">Sign up</Link></>}
          {user?.role === "user" && <NavLink to="/my-applications">My Applications</NavLink>}
          {user?.role === "company" && <NavLink to="/company">Dashboard</NavLink>}
          {user?.role === "admin" && <NavLink to="/admin">Admin</NavLink>}
          {user && <button className="btn secondary" onClick={out}>Logout</button>}
        </div>
      </div>
    </nav>
  );
}
