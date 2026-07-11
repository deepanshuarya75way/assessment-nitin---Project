import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import PageWrapper from "../components/PageWrapper";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [tab, setTab] = useState("users");
  const [rows, setRows] = useState([]);

  const loadStats = () => api.get("/admin/stats").then(({ data }) => setStats(data));
  const loadTab = (t) => api.get(`/admin/${t}`).then(({ data }) => setRows(data));

  useEffect(() => { loadStats(); loadTab(tab); }, [tab]);

  const removeUser = async (id) => { await api.delete(`/admin/users/${id}`); toast.success("Removed"); loadTab(tab); loadStats(); };

  return (
    <PageWrapper>
      <h1 style={{ marginBottom: 18 }}>Admin Control Panel</h1>
      {stats && (
        <div className="grid" style={{ marginBottom: 24 }}>
          {Object.entries(stats).map(([k, v]) => (
            <div key={k} className="card" style={{ textAlign: "center" }}>
              <div style={{ fontSize: 34, fontWeight: 800, color: "var(--accent2)" }}>{v}</div>
              <div style={{ color: "var(--muted)", textTransform: "capitalize" }}>{k}</div>
            </div>
          ))}
        </div>
      )}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {["users", "jobs", "applications"].map((t) => (
          <button key={t} className={tab === t ? "btn" : "btn secondary"} onClick={() => setTab(t)} style={{ textTransform: "capitalize" }}>{t}</button>
        ))}
      </div>
      <div className="grid">
        {rows.map((r) => (
          <div key={r._id} className="card">
            {tab === "users" && <><h3>{r.name}</h3><p style={{ color: "var(--muted)" }}>{r.email} · {r.role}</p>
              {r.role !== "admin" && <button className="btn danger" style={{ marginTop: 10 }} onClick={() => removeUser(r._id)}>Delete</button>}</>}
            {tab === "jobs" && <><h3>{r.title}</h3><p style={{ color: "var(--muted)" }}>{r.company?.companyName} · {r.location}</p></>}
            {tab === "applications" && <><h3>{r.job?.title}</h3><p style={{ color: "var(--muted)" }}>{r.applicant?.name} → {r.company?.companyName}</p><span className={`badge ${r.status}`}>{r.status}</span></>}
          </div>
        ))}
      </div>
    </PageWrapper>
  );
}
