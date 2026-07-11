import Application from "../models/Application.js";
import Job from "../models/Job.js";

// POST /api/applications/:jobId  (user, multipart with 'resume')
export const applyToJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (!req.file) return res.status(400).json({ message: "Resume file is required" });

    const existing = await Application.findOne({ job: job._id, applicant: req.user._id });
    if (existing) return res.status(400).json({ message: "You already applied to this job" });

    const application = await Application.create({
      job: job._id,
      applicant: req.user._id,
      company: job.company,
      coverLetter: req.body.coverLetter,
      resume: `/uploads/${req.file.filename}`,
    });
    res.status(201).json(application);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/applications/mine  (user)
export const getMyApplications = async (req, res) => {
  const apps = await Application.find({ applicant: req.user._id })
    .populate({ path: "job", select: "title location type" })
    .populate("company", "companyName name")
    .sort("-createdAt");
  res.json(apps);
};

// PUT /api/applications/:id  (user edits their own: coverLetter / new resume)
export const updateApplication = async (req, res) => {
  const app = await Application.findById(req.params.id);
  if (!app) return res.status(404).json({ message: "Application not found" });
  if (app.applicant.toString() !== req.user._id.toString())
    return res.status(403).json({ message: "Not your application" });
  if (["approved", "rejected"].includes(app.status))
    return res.status(400).json({ message: "Cannot edit a finalized application" });

  if (req.body.coverLetter !== undefined) app.coverLetter = req.body.coverLetter;
  if (req.file) app.resume = `/uploads/${req.file.filename}`;
  await app.save();
  res.json(app);
};

// PATCH /api/applications/:id/withdraw  (user)
export const withdrawApplication = async (req, res) => {
  const app = await Application.findById(req.params.id);
  if (!app) return res.status(404).json({ message: "Application not found" });
  if (app.applicant.toString() !== req.user._id.toString())
    return res.status(403).json({ message: "Not your application" });
  app.status = "withdrawn";
  await app.save();
  res.json(app);
};

// GET /api/applications/job/:jobId  (company sees applicants + resumes)
export const getJobApplications = async (req, res) => {
  const job = await Job.findById(req.params.jobId);
  if (!job) return res.status(404).json({ message: "Job not found" });
  if (req.user.role !== "admin" && job.company.toString() !== req.user._id.toString())
    return res.status(403).json({ message: "Not your job post" });

  const apps = await Application.find({ job: job._id })
    .populate("applicant", "name email headline location")
    .sort("-createdAt");
  res.json(apps);
};

// PATCH /api/applications/:id/status  (company approves/rejects)
export const decideApplication = async (req, res) => {
  const { status } = req.body; // 'approved' | 'rejected'
  if (!["approved", "rejected"].includes(status))
    return res.status(400).json({ message: "Invalid status" });

  const app = await Application.findById(req.params.id);
  if (!app) return res.status(404).json({ message: "Application not found" });
  if (req.user.role !== "admin" && app.company.toString() !== req.user._id.toString())
    return res.status(403).json({ message: "Not your applicant" });

  app.status = status;
  await app.save();
  res.json(app);
};
