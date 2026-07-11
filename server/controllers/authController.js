import jwt from "jsonwebtoken";
import User from "../models/User.js";

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });

const sanitize = (u) => ({
  _id: u._id, name: u.name, email: u.email, role: u.role,
  companyName: u.companyName, headline: u.headline, location: u.location,
});

// POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, email, password, role, companyName } = req.body;
    if (role === "admin")
      return res.status(403).json({ message: "Admin accounts cannot self-register" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already in use" });

    const user = await User.create({ name, email, password, role, companyName });
    res.status(201).json({ token: signToken(user._id), user: sanitize(user) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/login  (shared, role checked client+server side)
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: "Invalid email or password" });

    // optional role guard so a company can't log into the user portal, etc.
    if (role && user.role !== role)
      return res.status(403).json({ message: `This login is for ${role}s only` });

    res.json({ token: signToken(user._id), user: sanitize(user) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/auth/me
export const getMe = async (req, res) => res.json({ user: sanitize(req.user) });
