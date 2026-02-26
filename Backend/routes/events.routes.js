import express from "express"
import { createEvent, getEvents} from "../controllers/events.controller.js"

import { protect, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

// 🔹 Public route for all authenticated users (Students, Admins, Super Admin)
router.get("/", protect, getEvents);


// 🔹 Protected routes (College Admin or Super Admin)
router.post("/create_events", protect, authorize("college_admin", "super_admin"), createEvent);

export default router;
