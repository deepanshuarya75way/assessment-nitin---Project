import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import PageWrapper from "../components/PageWrapper";
import { useAuth } from "../context/AuthContext";

export default function JobDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [resume, setResume] = useState(null);

  useEffect(() => { api.get(`/jobs/${id}`).then(({ data }) => setJob(data)); }, [id]);

  const apply = async (e) => {
    e.preventDefault();
    if (!resume) return toast.error("Attach your resume");
    const fd = new FormData();
    fd.append("coverLetter", coverLetter);
    fd.append("resume", resume);
    try {
      await api.post(`/applications/${id}`, fd);
      toast.success("Application sent!");
      setCoverLetter(""); setResume(null);
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); }
  };

  if (!job) return <PageWrapper>Loading...</PageWrapper>;

  return (
    <PageWrapper>
      <div className="card">
        <h1>{job.title}</h1>
        <p style={{ color: "var(--muted)" }}>{job.company?.companyName} · {job.location} · {job.type} · {job.salary}</p>
        <p style={{ margin: "16px 0" }}>{job.description}</p>
        <div>{job.skills?.map((s) => <span key={s} className="badge approved" style={{ marginRight: 6 }}>{s}</span>)}</div>
      </div>

      {user?.role === "user" && (
        <form onSubmit={apply} className="card" style={{ marginTop: 20 }}>
          <h3>Apply to this job</h3>
          <textarea rows={4} placeholder="Cover letter (optional)" value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} />
          <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setResume(e.target.files[0])} />
          <button className="btn">Send application + resume</button>
        </form>
      )}
      {!user && <p style={{ marginTop: 16, color: "var(--muted)" }}>Log in as a job seeker to apply.</p>}
    </PageWrapper>
  );
}
