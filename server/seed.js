import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import User from "./models/User.js";
import Job from "./models/Job.js";
import Application from "./models/Application.js";

dotenv.config();

const run = async () => {
  await connectDB();
  await Promise.all([User.deleteMany(), Job.deleteMany(), Application.deleteMany()]);

  const admin = await User.create({ name: "Site Admin", email: "admin@demo.com", password: "admin123", role: "admin" });
  const company = await User.create({ name: "Acme HR", email: "company@demo.com", password: "company123", role: "company", companyName: "Acme Inc.", about: "We build cool things." });
  const user = await User.create({ name: "Jane Seeker", email: "user@demo.com", password: "user123", role: "user", headline: "Full-stack developer", location: "Remote" });

  await Job.create([
    { title: "Frontend Developer", description: "React + Tailwind role.", location: "Remote", type: "Full-time", salary: "$70k-$90k", skills: ["React", "CSS"], company: company._id },
    { title: "Backend Engineer", description: "Node + MongoDB APIs.", location: "Bengaluru", type: "Full-time", salary: "₹20L-₹30L", skills: ["Node", "MongoDB"], company: company._id },
  ]);

  console.log("🌱 Seeded! Logins => admin@demo.com/admin123, company@demo.com/company123, user@demo.com/user123");
  await mongoose.disconnect();
  process.exit(0);
};

run().catch((e) => { console.error(e); process.exit(1); });
