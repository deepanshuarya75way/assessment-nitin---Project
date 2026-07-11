import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import PageWrapper from "../components/PageWrapper";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", role: "user" });

  const submit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(form);
      toast.success(`Welcome back, ${user.name}`);
      nav(user.role === "admin" ? "/admin" : user.role === "company" ? "/company" : "/jobs");
    } catch (err) { toast.error(err.response?.data?.message || "Login failed"); }
  };

  return (
    <PageWrapper>
      <div className="card" style={{ maxWidth: 420, margin: "40px auto" }}>
        <h1>Login</h1>
        <div style={{ display: "flex", gap: 8, margin: "12px 0" }}>
          {["user", "company", "admin"].map((r) => (
            <button type="button" key={r} onClick={() => setForm({ ...form, role: r })}
              className={form.role === r ? "btn" : "btn secondary"} style={{ flex: 1, textTransform: "capitalize" }}>{r}</button>
          ))}
        </div>
        <form onSubmit={submit}>
          <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <button className="btn" style={{ width: "100%" }}>Login as {form.role}</button>
        </form>
      </div>
    </PageWrapper>
  );
}
