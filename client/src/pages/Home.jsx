import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PageWrapper from "../components/PageWrapper";

export default function Home() {
  return (
    <PageWrapper>
      <div style={{ textAlign: "center", padding: "80px 0" }}>
        <motion.h1 initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }} style={{ fontSize: 48, marginBottom: 16 }}>
          Find your next <span style={{ background: "linear-gradient(135deg,var(--accent),var(--accent2))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>opportunity</span>
        </motion.h1>
        <p style={{ color: "var(--muted)", maxWidth: 560, margin: "0 auto 28px" }}>
          Job seekers, companies, and admins — all in one smooth platform. Apply, hire, and chat in real time.
        </p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center" }}>
          <Link to="/jobs" className="btn">Browse jobs</Link>
          <Link to="/register" className="btn secondary">Get started</Link>
        </div>
      </div>
    </PageWrapper>
  );
}
