import Query from "../models/Query.js";
import User from "../models/User.js";

const hits = new Map(); // simple per-IP throttle: 5 queries / 10 min
const limited = (ip) => {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 600000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
};

// GET /api/contact/admin  (public: admin name + email)
export const getAdminContact = async (req, res) => {
  const admin = await User.findOne({ role: "admin" }).sort("createdAt");
  res.json({ name: admin?.name || "Site Admin", email: admin?.email || process.env.CONTACT_EMAIL || "" });
};

// POST /api/contact
export const submitQuery = async (req, res) => {
  if (limited(req.ip)) return res.status(429).json({ message: "Too many queries. Please try again later." });
  const { name, email, topic, subject, message } = req.body;
  if (!name?.trim() || !subject?.trim() || !message?.trim()) return res.status(400).json({ message: "Name, subject and message are required" });
  if (!/^\S+@\S+\.\S+$/.test(email || "")) return res.status(400).json({ message: "Enter a valid email address" });
  if (message.trim().length < 10) return res.status(400).json({ message: "Message must be at least 10 characters" });
  await Query.create({ name, email, topic, subject, message });
  res.status(201).json({ message: "Query sent" });
};

// admin: GET /api/admin/queries, PATCH /api/admin/queries/:id, DELETE /api/admin/queries/:id
export const listQueries = async (req, res) => res.json(await Query.find().sort("-createdAt"));
export const toggleQuery = async (req, res) => {
  const q = await Query.findById(req.params.id);
  if (!q) return res.status(404).json({ message: "Query not found" });
  q.resolved = !q.resolved;
  await q.save();
  res.json(q);
};
export const deleteQuery = async (req, res) => {
  await Query.findByIdAndDelete(req.params.id);
  res.json({ message: "Query removed" });
};
