import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import PageWrapper from "../components/PageWrapper";

const blank = { title: "", description: "", location: "", type: "Full-time", salary: "", skills: "" };

export default function CompanyDashboard() {
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState(blank);
  const [editId, setEditId] = useState(null);

  const load = () => api.get("/jobs/mine").then(({ data }) => setJobs(data));
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    const payload = { ...form, skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean) };
    if (editId) { await api.put(`/jobs/${editId}`, payload); toast.success("Job updated"); }
    else { await api.post("/jobs", payload); toast.success("Job posted"); }
    setForm(blank); setEditId(null); load();
  };

  const edit = (job) => { setEditId(job._id); setForm({ ...job, skills: job.skills.join(", ") }); };
  const del = async (id) => { await api.delete(`/jobs/${id}`); toast.success("Deleted"); load(); };

  return (
    <PageWrapper>
      <h1 style={{ marginBottom: 18 }}>Company Dashboard</h1>
      <form onSubmit={submit} className="card" style={{ marginBottom: 24 }}>
        <h3>{editId ? "Edit job" : "Post a new job"}</h3>
        <input placeholder="Job title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <textarea rows={3} placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
        <div style={{ display: "flex", gap: 10 }}>
          <input placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            <option>Full-time</option><option>Part-time</option><option>Contract</option><option>Internship</option>
          </select>
        </div>
        <input placeholder="Salary (e.g. $70k-$90k)" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} />
        <input placeholder="Skills (comma separated)" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} />
        <button className="btn">{editId ? "Update job" : "Post job"}</button>{" "}
        {editId && <button type="button" className="btn secondary" onClick={() => { setForm(blank); setEditId(null); }}>Cancel</button>}
      </form>

      <h2 style={{ marginBottom: 12 }}>Your job posts</h2>
      <div className="grid">
        {jobs.map((job) => (
          <div key={job._id} className="card">
            <h3>{job.title}</h3>
            <p style={{ color: "var(--muted)" }}>{job.location} · {job.type}</p>
            <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Link className="btn" to={`/company/jobs/${job._id}/applicants`}>Applicants</Link>
              <button className="btn secondary" onClick={() => edit(job)}>Edit</button>
              <button className="btn danger" onClick={() => del(job._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </PageWrapper>
  );
}