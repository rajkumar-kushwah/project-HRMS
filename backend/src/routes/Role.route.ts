import express from "express";
import { createRole, deleteRole, getRole, updateRole } from "../controllers/Role.controller.ts";


// role.routes.ts
const router = express.Router();

router.post('/', createRole);
router.get('/', getRole);
router.put('/:id', updateRole);
router.delete('/:id', deleteRole);

export default router;