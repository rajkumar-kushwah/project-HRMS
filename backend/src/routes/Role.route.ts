import express from "express";
import { createRole, deleteRole, getRole, updateRole } from "../controllers/Role.controller.ts";
import { protect } from "../middleware/auth.middleware.ts";
import { checkPermissions } from "../middleware/role.middleware.ts";

// role.routes.ts
const router = express.Router();
router.post('/', protect, checkPermissions("CREATE.ROLE"), createRole);

router.get('/', protect, checkPermissions("VIEW.ROLE"), getRole);

router.put('/:id', protect, checkPermissions("UPDATE.ROLE"), updateRole);

router.delete('/:id', protect, checkPermissions("DELETE.ROLE"), deleteRole);

export default router;