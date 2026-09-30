import User from "../models/User.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";
import Query from "../models/Query.js";

// GET /api/admin/stats
export const getStats = async (req, res) => {
  const [users, companies, jobs, applications, queries] = await Promise.all([
    User.countDocuments({ role: "user" }),
    User.countDocuments({ role: "company" }),
    Job.countDocuments(),
    Application.countDocuments(),
    Query.countDocuments({ resolved: false }),
  ]);
  res.json({ users, companies, jobs, applications, queries });
};

// GET /api/admin/users?role=
export const listUsers = async (req, res) => {
  const q = {};
  if (req.query.role) q.role = req.query.role;
  const users = await User.find(q).sort("-createdAt");
  res.json(users);
};

// DELETE /api/admin/users/:id
export const deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  await Job.deleteMany({ company: req.params.id });
  await Application.deleteMany({ $or: [{ applicant: req.params.id }, { company: req.params.id }] });
  res.json({ message: "User and related data removed" });
};

// GET /api/admin/jobs
export const listJobs = async (req, res) => {
  const jobs = await Job.find().populate("company", "companyName name").sort("-createdAt");
  res.json(jobs);
};

// GET /api/admin/applications
export const listApplications = async (req, res) => {
  const apps = await Application.find()
    .populate("applicant", "name email")
    .populate("company", "companyName name")
    .populate("job", "title")
    .sort("-createdAt");
  res.json(apps);
};
