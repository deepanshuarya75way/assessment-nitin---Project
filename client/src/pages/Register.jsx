import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import PageWrapper from "../components/PageWrapper";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "user", companyName: "" });

  const submit = async (e) => {
    e.preventDefault();
    try {
      const user = await register(form);
      toast.success("Account created!");
      nav(user.role === "company" ? "/company" : "/jobs");
    } catch (err) { toast.error(err.response?.data?.message || "Registration failed"); }
  };

  return (
    <PageWrapper>
      <div className="card" style={{ maxWidth: 420, margin: "40px auto" }}>
        <h1>Create account</h1>
        <div style={{ display: "flex", gap: 8, margin: "12px 0" }}>
          {["user", "company"].map((r) => (
            <button type="button" key={r} onClick={() => setForm({ ...form, role: r })}
              className={form.role === r ? "btn" : "btn secondary"} style={{ flex: 1, textTransform: "capitalize" }}>{r === "user" ? "Job Seeker" : "Company"}</button>
          ))}
        </div>
        <form onSubmit={submit}>
          <input placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          {form.role === "company" && <input placeholder="Company name" value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} required />}
          <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input type="password" placeholder="Password (min 6 chars)" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <button className="btn" style={{ width: "100%" }}>Sign up</button>
        </form>
      </div>
    </PageWrapper>
  );
}
