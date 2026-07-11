import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import PageWrapper from "../components/PageWrapper";
import Chat from "../components/Chat";

export default function MyApplications() {
  const [apps, setApps] = useState([]);
  const [editing, setEditing] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [resume, setResume] = useState(null);
  const [chatWith, setChatWith] = useState(null);

  const load = () => api.get("/applications/mine").then(({ data }) => setApps(data));
  useEffect(() => { load(); }, []);

  const saveEdit = async (id) => {
    const fd = new FormData();
    fd.append("coverLetter", coverLetter);
    if (resume) fd.append("resume", resume);
    await api.put(`/applications/${id}`, fd);
    toast.success("Application updated");
    setEditing(null); setResume(null); load();
  };

  const withdraw = async (id) => {
    await api.patch(`/applications/${id}/withdraw`);
    toast.success("Application withdrawn");
    load();
  };

  return (
    <PageWrapper>
      <h1 style={{ marginBottom: 18 }}>My Applications</h1>
      <div className="grid">
        {apps.map((a) => (
          <div key={a._id} className="card">
            <h3>{a.job?.title}</h3>
            <p style={{ color: "var(--muted)" }}>{a.company?.companyName} · {a.job?.location}</p>
            <span className={`badge ${a.status}`}>{a.status}</span>

            {editing === a._id ? (
              <div style={{ marginTop: 12 }}>
                <textarea rows={3} defaultValue={a.coverLetter} onChange={(e) => setCoverLetter(e.target.value)} />
                <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setResume(e.target.files[0])} />
                <button className="btn" onClick={() => saveEdit(a._id)}>Save</button>{" "}
                <button className="btn secondary" onClick={() => setEditing(null)}>Cancel</button>
              </div>
            ) : (
              <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
                <a className="btn secondary" href={`${import.meta.env.VITE_API_URL}${a.resume}`} target="_blank" rel="noreferrer">View resume</a>
                {!["approved","rejected","withdrawn"].includes(a.status) && (
                  <>
                    <button className="btn" onClick={() => { setEditing(a._id); setCoverLetter(a.coverLetter || ""); }}>Edit</button>
                    <button className="btn danger" onClick={() => withdraw(a._id)}>Withdraw</button>
                  </>
                )}
                <button className="btn secondary" onClick={() => setChatWith({ id: a.company._id, name: a.company.companyName || a.company.name })}>Chat</button>
              </div>
            )}
          </div>
        ))}
        {apps.length === 0 && <p style={{ color: "var(--muted)" }}>You haven't applied to any jobs yet.</p>}
      </div>

      {chatWith && <div style={{ marginTop: 24 }}><Chat otherId={chatWith.id} otherName={chatWith.name} /></div>}
    </PageWrapper>
  );
}
