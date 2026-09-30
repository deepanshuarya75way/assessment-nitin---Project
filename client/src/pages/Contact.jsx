import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import PageWrapper from "../components/PageWrapper";
import { useAuth } from "../context/AuthContext";

const topics = ["General question", "Job seeker help", "Hiring / company account", "Report a problem", "Feedback"];

export default function Contact() {
  const { user } = useAuth();
  const [admin, setAdmin] = useState(null);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", topic: topics[0], subject: "", message: "" });

  useEffect(() => { api.get("/contact/admin").then(({ data }) => setAdmin(data)).catch(() => {}); }, []);
  useEffect(() => { if (user) setForm((f) => ({ ...f, name: f.name || user.name, email: f.email || user.email })); }, [user]);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await api.post("/contact", form);
      toast.success("Query sent. The admin will reply by email.");
      setForm({ ...form, subject: "", message: "" });
    } catch (err) { toast.error(err.response?.data?.message || "Could not send your query"); }
    finally { setSending(false); }
  };

  return (
    <PageWrapper>
      <div style={{ padding: "32px 0 0" }}>
        <h1 style={{ fontSize: "clamp(36px,5vw,56px)", marginBottom: 12 }}>Contact us</h1>
        <p className="muted" style={{ fontSize: 20, maxWidth: 560 }}>Questions about jobs, your account or the platform? Reach the admin directly or send a query below.</p>
      </div>
      <div className="contact">
        <div className="card">
          <h3>Site admin</h3>
          <div className="avatar" style={{ marginTop: 18 }}>{(admin?.name || "A")[0]}</div>
          <p style={{ fontWeight: 600, fontSize: 19 }}>{admin?.name || "Loading..."}</p>
          <p className="muted" style={{ marginTop: 14 }}>Email</p>
          {admin?.email ? <a href={`mailto:${admin.email}`} style={{ color: "var(--accent2)", fontWeight: 600 }}>{admin.email}</a> : <p>—</p>}
        </div>
        <form className="card" onSubmit={submit}>
          <h3 style={{ marginBottom: 18 }}>Send a query</h3>
          <div className="row2">
            <div><label htmlFor="cn">Your name</label><input id="cn" value={form.name} onChange={set("name")} required /></div>
            <div><label htmlFor="ce">Your email</label><input id="ce" type="email" value={form.email} onChange={set("email")} required /></div>
          </div>
          <label htmlFor="ct">Topic</label>
          <select id="ct" value={form.topic} onChange={set("topic")}>{topics.map((t) => <option key={t}>{t}</option>)}</select>
          <label htmlFor="cs">Subject</label>
          <input id="cs" value={form.subject} onChange={set("subject")} required maxLength={120} />
          <label htmlFor="cm">Message</label>
          <textarea id="cm" rows={6} value={form.message} onChange={set("message")} required minLength={10} maxLength={2000} />
          <button className="btn lg" disabled={sending}>{sending ? "Sending..." : "Send query"}</button>
        </form>
      </div>
    </PageWrapper>
  );
}
