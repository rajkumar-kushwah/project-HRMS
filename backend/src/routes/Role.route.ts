import express from "express";
import { createRole, deleteRole, getRole, updateRole } from "../controllers/Role.controller.ts";
import {  protect } from "../middleware/auth.middleware.ts";
import { checkPermissions } from "../middleware/role.middleware.ts";

// role.routes.ts
const router = express.Router();

router.post('/',protect, checkPermissions("CREATE_ROLE"), createRole);
router.get('/', protect, checkPermissions("READ_ROLE"), getRole);
router.put('/:id', protect, checkPermissions("UPDATE_ROLE"), updateRole);
router.delete('/:id', protect, checkPermissions("DELETE_ROLE"), deleteRole);

export default router;