import UserModel         from "../models/User.model.js";
import EventModel        from "../models/Event.js";
import RegistrationModel from "../models/Registration.js";

const User         = UserModel;
const Event        = EventModel;
const Registration = RegistrationModel;

// ── GET /api/superadmin/stats ─────────────────────────────────────────────────
export const getSuperAdminStats = async (req, res) => {
  try {
    const [
      totalEvents,
      totalColleges,
      totalStudents,
      totalRegistrations,
      pendingAdmins,
    ] = await Promise.all([
      Event.countDocuments({}),
      User.countDocuments({ role: "college_admin" }),
      User.countDocuments({ role: "student" }),
      Registration.countDocuments({}),
      0
    ]);

    res.json({
      success: true,
      data: {
        totalEvents,
        totalColleges,
        totalStudents,
        totalRegistrations,
        pendingAdmins,
      },
    });
  } catch (err) {
    console.error("getSuperAdminStats error:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// ── GET /api/superadmin/students ──────────────────────────────────────────────
// All students with their registration counts
export const getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" })
      .select("-password")
      .sort({ createdAt: -1 });

    // For each student, get registration count
    const studentIds = students.map((s) => s._id);
    const regCounts  = await Registration.aggregate([
      { $match: { user_id: { $in: studentIds } } },
      { $group: { _id: "$user_id", count: { $sum: 1 } } },
    ]);

    const countMap = {};
    regCounts.forEach((r) => { countMap[r._id.toString()] = r.count; });

    const result = students.map((s) => ({
      ...s.toObject(),
      registrationCount: countMap[s._id.toString()] || 0,
    }));

    res.json({ success: true, students: result, total: result.length });
  } catch (err) {
    console.error("getAllStudents error:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// ── GET /api/superadmin/students/:id/registrations ────────────────────────────
// One student's registrations
export const getStudentRegistrations = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await User.findById(id).select("-password");
    if (!student || student.role !== "student") {
      return res.status(404).json({ message: "Student not found." });
    }

    const registrations = await Registration.find({ user_id: id })
      .populate("event_id", "title category start_date end_date location collegeName status image")
      .sort({ createdAt: -1 });

    res.json({ success: true, student, registrations });
  } catch (err) {
    console.error("getStudentRegistrations error:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// ── GET /api/superadmin/registrations ─────────────────────────────────────────
// All registrations — with event + student populated, filterable
export const getAllRegistrations = async (req, res) => {
  try {
    const { eventId, status, search } = req.query;

    let query = {};
    if (status && status !== "all") query.status = status;
    if (eventId) query.event = eventId;

    let registrations = await Registration.find(query)
      .populate({
        path: "event_id",
        select: "title category start_date location collegeName",
      })
      .populate({
        path: "user_id",
        select: "name email college",
      })
      .sort({ createdAt: -1 });

    console.log(registrations[0]);
 
   

    // Search by student name or event title
    if (search) {
      const q = search.toLowerCase();
      registrations = registrations.filter(
        (r) =>
          r.user_id?.name?.toLowerCase().includes(q) ||
          r.event_id?.title?.toLowerCase().includes(q) ||
          r.user_id?.college?.toLowerCase().includes(q)
      );
    }

    res.json({ success: true, registrations, total: registrations.length });
  } catch (err) {
    console.error("getAllRegistrations error:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// ── GET /api/superadmin/college-admins ────────────────────────────────────────
// All college admins (approved + pending)
export const getAllCollegeAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: "college_admin" })
      .select("-password")
      .sort({ createdAt: -1 });

    // For each admin, count their events
    const eventCounts = await Event.aggregate([
      { $group: { _id: "$collegeName", count: { $sum: 1 } } },
    ]);
    const ecMap = {};
    eventCounts.forEach((e) => { ecMap[e._id] = e.count; });

    const result = admins.map((a) => ({
      ...a.toObject(),
      eventCount: ecMap[a.college] || 0,
    }));

    res.json({ success: true, admins: result, total: result.length });
  } catch (err) {
    console.error("getAllCollegeAdmins error:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// ── GET /api/superadmin/users ─────────────────────────────────────────────────
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password").sort({ createdAt: -1 });
    res.json({ success: true, users, total: users.length });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// ── PATCH /api/superadmin/users/:id/deactivate ───────────────────────────────
export const deactivateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!user) return res.status(404).json({ message: "User not found." });
    res.json({ success: true, message: "User deactivated.", user });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};