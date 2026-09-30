import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import PageWrapper from "../components/PageWrapper";

const steps = [
  ["Create your account", "Sign up as a job seeker or a company in under a minute."],
  ["Apply or post a role", "Seekers attach a resume and cover letter. Companies publish openings."],
  ["Decide and talk", "Companies approve or reject applicants, and both sides chat in real time."],
];

export default function Home() {
  const nav = useNavigate();
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [jobs, setJobs] = useState([]);

  useEffect(() => { api.get("/jobs").then(({ data }) => setJobs(data.slice(0, 3))).catch(() => {}); }, []);

  const go = (e) => {
    e.preventDefault();
    nav(`/jobs?search=${encodeURIComponent(search)}&type=${encodeURIComponent(type)}`);
  };

  return (
    <PageWrapper>
      <section className="hero">
        <div>
          <h1>Find a job you want to show up for.</h1>
          <p className="lead">Search open roles, apply with your resume, and chat with hiring teams. Companies post jobs and review applicants in the same place.</p>
          <div className="hero-actions">
            <Link to="/jobs" className="btn lg">Browse jobs</Link>
            <Link to="/register" className="btn secondary lg">Create an account</Link>
          </div>
        </div>
        <form className="panel" onSubmit={go}>
          <h3>Search open roles</h3>
          <label htmlFor="q">Job title</label>
          <input id="q" placeholder="e.g. Frontend Developer" value={search} onChange={(e) => setSearch(e.target.value)} />
          <label htmlFor="t">Job type</label>
          <select id="t" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">All types</option>
            <option>Full-time</option><option>Part-time</option><option>Contract</option><option>Internship</option>
          </select>
          <button className="btn lg" style={{ width: "100%" }}>Search jobs</button>
        </form>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Latest openings</h2>
          <Link to="/jobs" className="btn secondary">View all jobs</Link>
        </div>
        <div className="grid">
          {jobs.map((job) => (
            <Link key={job._id} to={`/jobs/${job._id}`} className="card">
              <div className="avatar">{(job.company?.companyName || job.company?.name || "J")[0]}</div>
              <h3>{job.title}</h3>
              <p className="muted">{job.company?.companyName || job.company?.name} · {job.location}</p>
              <span className="badge approved" style={{ marginTop: 14 }}>{job.type}</span>
            </Link>
          ))}
          {jobs.length === 0 && <p className="muted">No openings yet. Check back soon.</p>}
        </div>
      </section>

      <section className="section">
        <h2 style={{ marginBottom: 32 }}>How JobHub works</h2>
        <div className="steps">
          {steps.map(([t, d], i) => (
            <div key={t} className="card"><div className="step-n">{i + 1}</div><h3>{t}</h3><p className="muted">{d}</p></div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="cta">
          <h2>Ready to get started?</h2>
          <p>Create a free account, or contact us if you have any questions first.</p>
          <div className="hero-actions" style={{ justifyContent: "center" }}>
            <Link to="/register" className="btn lg">Sign up free</Link>
            <Link to="/contact" className="btn secondary lg">Contact us</Link>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
