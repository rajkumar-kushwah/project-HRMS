import { signin, signup, deleteUser, logout, UpdateUser } from "../controllers/auth.controlller.ts";
import express from "express";
import { protect } from "../middleware/auth.middleware.ts";
import { getprofile } from "../controllers/profile.controller.ts";

const router = express.Router();
router.use(protect);

const authRouter = express.Router();

authRouter.post('/signup', signup)
authRouter.post('/signin', signin)
authRouter.delete('/users/:id', deleteUser)
authRouter.post('/logout', protect, logout)
authRouter.get('/profile', protect, getprofile)

authRouter.put('/users/:id', protect, UpdateUser)

export default authRouter

