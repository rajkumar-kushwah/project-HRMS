import { protect } from "../middleware/auth.middleware.ts";
import express from "express";
import { createEmployee, getEmployees, updateEmployee, deleteEmployee } from "../controllers/Employee.controller.ts";
import { checkPermissions } from "../middleware/role.middleware.ts";

const router = express.Router();
router.use(protect);

router.post('/', protect, checkPermissions("CREATE.EMPLOYEE"), createEmployee);

router.get('/', protect, checkPermissions("VIEW.EMPLOYEE"), getEmployees);

router.put('/:id', protect, checkPermissions("UPDATE.EMPLOYEE"), updateEmployee);

router.delete('/:id', protect, checkPermissions("DELETE.EMPLOYEE"), deleteEmployee);

export default router