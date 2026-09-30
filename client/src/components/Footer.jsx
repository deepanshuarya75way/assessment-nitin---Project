import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid" style={{ padding: "56px 28px 32px" }}>
        <div>
          <Link to="/" className="logo">Job<span style={{ color: "var(--accent2)" }}>Hub</span></Link>
          <p className="muted" style={{ marginTop: 12, maxWidth: 320 }}>Job seekers, companies and admins on one platform. Apply, hire and chat in real time.</p>
        </div>
        <div>
          <h4>Explore</h4>
          <ul><li><Link to="/jobs">Browse jobs</Link></li><li><Link to="/register">Create account</Link></li><li><Link to="/login">Log in</Link></li></ul>
        </div>
        <div>
          <h4>Support</h4>
          <ul><li><Link to="/contact">Contact us</Link></li><li><Link to="/contact">Ask a question</Link></li></ul>
        </div>
        <div>
          <h4>Get in touch</h4>
          <p className="muted">Have a question or a problem? Send it to the admin from the contact page.</p>
          <Link to="/contact" className="btn secondary" style={{ marginTop: 14 }}>Contact us</Link>
        </div>
      </div>
      <div className="container footer-bottom" style={{ padding: "20px 28px" }}>
        <span>© {new Date().getFullYear()} JobHub. All rights reserved.</span>
        <span>Made for job seekers and hiring teams.</span>
      </div>
    </footer>
  );
}
