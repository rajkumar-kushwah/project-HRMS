import { protect } from "../middleware/auth.middleware.ts";
import { checkPermissions } from "../middleware/role.middleware.ts";
import { checkIn, checkOut, getAttendance } from "../controllers/checkIn.controller.ts";
import express from "express";

const router = express.Router();
router.use(protect);

router.post('/', protect, checkPermissions("CHECKIN.CHECKIN"), checkIn);

router.post('/checkout', protect, checkPermissions("CHECKIN.CHECKOUT"), checkOut);

router.get('/', protect, checkPermissions("CHECKIN.VIEW"), getAttendance);

export default router