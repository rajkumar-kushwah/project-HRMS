import "dotenv/config";
import dotenv from "dotenv";
import express from "express";
import cors from 'cors'
import { prisma } from "./config/db.ts";
import authRouter from "./routes/auth.route.ts";
import { sessionMiddlewere } from "./config/session.ts";
import departmentRouter from "./routes/department.route.ts";
import permissionRouter from "./routes/permission.route.ts";
import roleRouter from "./routes/Role.route.ts";

dotenv.config();
const app = express();
const port = 5000;

app.use(sessionMiddlewere)
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));


app.use(express.json());


app.use('/auth', authRouter)
app.use('/department', departmentRouter)
app.use('/permission', permissionRouter)
app.use('/role', roleRouter)

async function start() {
    await prisma.$connect();
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}

start();

