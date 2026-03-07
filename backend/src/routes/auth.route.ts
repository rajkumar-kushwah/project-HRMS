import { login, signup,deleteUser, logout  } from "../controllers/auth.controlller.ts";
import express from "express";
import { protect } from "../middleware/auth.middleware.ts";
import { getprofile } from "../controllers/profile.controller.ts";

const router = express.Router();
router.use(protect);

const authRouter = express.Router();

authRouter.post('/signup', signup)
authRouter.post('/login', login)
authRouter.delete('/users/:id', deleteUser)
authRouter.post('/logout', protect, logout)
authRouter.get('/profile', protect, getprofile)

export default authRouter

