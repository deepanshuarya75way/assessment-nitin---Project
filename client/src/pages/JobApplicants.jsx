import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import PageWrapper from "../components/PageWrapper";
import Chat from "../components/Chat";

export default function JobApplicants() {
  const { id } = useParams();
  const [apps, setApps] = useState([]);
  const [chatWith, setChatWith] = useState(null);

  const load = () => api.get(`/applications/job/${id}`).then(({ data }) => setApps(data));
  useEffect(() => { load(); }, [id]);

  const decide = async (appId, status) => {
    await api.patch(`/applications/${appId}/status`, { status });
    toast.success(`Application ${status}`);
    load();
  };

  return (
    <PageWrapper>
      <h1 style={{ marginBottom: 18 }}>Applicants</h1>
      <div className="grid">
        {apps.map((a) => (
          <div key={a._id} className="card">
            <h3>{a.applicant?.name}</h3>
            <p style={{ color: "var(--muted)" }}>{a.applicant?.headline} · {a.applicant?.email}</p>
            <span className={`badge ${a.status}`}>{a.status}</span>
            {a.coverLetter && <p style={{ margin: "10px 0", fontSize: 14 }}>{a.coverLetter}</p>}
            <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
              <a className="btn secondary" href={`${import.meta.env.VITE_API_URL}${a.resume}`} target="_blank" rel="noreferrer">View resume</a>
              <button className="btn" onClick={() => decide(a._id, "approved")}>Approve</button>
              <button className="btn danger" onClick={() => decide(a._id, "rejected")}>Reject</button>
              <button className="btn secondary" onClick={() => setChatWith({ id: a.applicant._id, name: a.applicant.name })}>Chat</button>
            </div>
          </div>
        ))}
        {apps.length === 0 && <p style={{ color: "var(--muted)" }}>No applicants yet.</p>}
      </div>
      {chatWith && <div style={{ marginTop: 24 }}><Chat otherId={chatWith.id} otherName={chatWith.name} /></div>}
    </PageWrapper>
  );
}
