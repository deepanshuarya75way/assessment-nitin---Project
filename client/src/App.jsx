import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import JobDetail from "./pages/JobDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyApplications from "./pages/MyApplications";
import CompanyDashboard from "./pages/CompanyDashboard";
import JobApplicants from "./pages/JobApplicants";
import AdminDashboard from "./pages/AdminDashboard";
import Contact from "./pages/Contact";
import Footer from "./components/Footer";

export default function App() {
  const location = useLocation();
  return (
    <div className="app">
      <Navbar />
      <main>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/my-applications" element={<ProtectedRoute roles={["user"]}><MyApplications /></ProtectedRoute>} />
          <Route path="/company" element={<ProtectedRoute roles={["company"]}><CompanyDashboard /></ProtectedRoute>} />
          <Route path="/company/jobs/:id/applicants" element={<ProtectedRoute roles={["company","admin"]}><JobApplicants /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute roles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
        </Routes>
      </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
