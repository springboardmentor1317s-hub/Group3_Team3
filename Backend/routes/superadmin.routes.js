import express from "express";
import { protect, authorize } from "../middleware/auth.middleware.js";
import {
  getSuperAdminStats,
  getAllStudents,
  getStudentRegistrations,
  getAllRegistrations,
  getAllCollegeAdmins,
  getAllUsers,
  deactivateUser,
} from "../controllers/superadmin.controller.js";

const router = express.Router();
router.use(protect, authorize("super_admin"));

router.get("/stats",                          getSuperAdminStats);
router.get("/students",                       getAllStudents);
router.get("/students/:id/registrations",     getStudentRegistrations);
router.get("/registrations",                  getAllRegistrations);
router.get("/college-admins",                 getAllCollegeAdmins);
router.get("/users",                          getAllUsers);
router.patch("/users/:id/deactivate",         deactivateUser);

export default router;