import { protect } from "../middleware/auth.middleware.ts";
import express from "express";
import { createEmployee, getEmployees,updateEmployee, deleteEmployee } from "../controllers/Employee.controller.ts";
import { checkPermissions } from "../middleware/role.middleware.ts";

const router = express.Router();
router.use(protect);

router.post('/', protect,  checkPermissions("CREATE_EMPLOYEE"), createEmployee)
router.get('/', protect,  checkPermissions("READ_EMPLOYEE"), getEmployees)
router.put('/:id', protect,  checkPermissions("UPDATE_EMPLOYEE"), updateEmployee)
router.delete('/:id', protect,  checkPermissions("DELETE_EMPLOYEE"), deleteEmployee)

export default router