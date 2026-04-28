import { protect } from "../middleware/auth.middleware.ts";
import { getMonthlyAttendance } from "../controllers/MonthlyAttendance.controller.ts";
import express from "express";

const router = express.Router();
router.use(protect);

router.get('/monthly', protect, getMonthlyAttendance);

export default router