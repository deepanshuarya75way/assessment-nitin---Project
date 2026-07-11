import Job from "../models/Job.js";

// GET /api/jobs?search=&location=&type=
export const getJobs = async (req, res) => {
  const { search, location, type } = req.query;
  const q = { status: "open" };
  if (search) q.title = { $regex: search, $options: "i" };
  if (location) q.location = { $regex: location, $options: "i" };
  if (type) q.type = type;
  const jobs = await Job.find(q).populate("company", "companyName name").sort("-createdAt");
  res.json(jobs);
};

// GET /api/jobs/:id
export const getJob = async (req, res) => {
  const job = await Job.findById(req.params.id).populate("company", "companyName name about website");
  if (!job) return res.status(404).json({ message: "Job not found" });
  res.json(job);
};

// GET /api/jobs/mine  (company's own jobs)
export const getMyJobs = async (req, res) => {
  const jobs = await Job.find({ company: req.user._id }).sort("-createdAt");
  res.json(jobs);
};

// POST /api/jobs  (company)
export const createJob = async (req, res) => {
  const job = await Job.create({ ...req.body, company: req.user._id });
  res.status(201).json(job);
};

// PUT /api/jobs/:id  (owner company or admin)
export const updateJob = async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ message: "Job not found" });
  if (req.user.role !== "admin" && job.company.toString() !== req.user._id.toString())
    return res.status(403).json({ message: "Not your job post" });
  Object.assign(job, req.body);
  await job.save();
  res.json(job);
};

// DELETE /api/jobs/:id  (owner company or admin)
export const deleteJob = async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ message: "Job not found" });
  if (req.user.role !== "admin" && job.company.toString() !== req.user._id.toString())
    return res.status(403).json({ message: "Not your job post" });
  await job.deleteOne();
  res.json({ message: "Job deleted" });
};
