import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api/axios";
import PageWrapper from "../components/PageWrapper";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");

  const load = async () => {
    const { data } = await api.get("/jobs", { params: { search, type } });
    setJobs(data);
  };
  useEffect(() => { load(); }, []);

  return (
    <PageWrapper>
      <h1 style={{ marginBottom: 18 }}>Open positions</h1>
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <input placeholder="Search title..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ margin: 0 }} />
        <select value={type} onChange={(e) => setType(e.target.value)} style={{ margin: 0, maxWidth: 180 }}>
          <option value="">All types</option>
          <option>Full-time</option><option>Part-time</option><option>Contract</option><option>Internship</option>
        </select>
        <button className="btn" onClick={load}>Search</button>
      </div>
      <div className="grid">
        {jobs.map((job, i) => (
          <motion.div key={job._id} className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <h3>{job.title}</h3>
            <p style={{ color: "var(--muted)", margin: "6px 0" }}>{job.company?.companyName || job.company?.name} · {job.location}</p>
            <span className="badge approved">{job.type}</span>
            <div style={{ marginTop: 14 }}><Link to={`/jobs/${job._id}`} className="btn secondary">View & apply</Link></div>
          </motion.div>
        ))}
        {jobs.length === 0 && <p style={{ color: "var(--muted)" }}>No jobs found.</p>}
      </div>
    </PageWrapper>
  );
}
