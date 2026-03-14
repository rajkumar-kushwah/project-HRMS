import "dotenv/config";
import dotenv from "dotenv";
import express from "express";
// import { PrismaPg } from '@prisma/adapter-pg'
// import { PrismaClient } from "./generated/prisma/client.js";
import cors from 'cors'
import { prisma } from "./config/db.ts";
import authRouter from "./routes/auth.route.ts";
import { sessionMiddlewere } from "./config/session.ts";




// const connectionString = `${process.env.DATABASE_URL}`

// const adapter = new PrismaPg({ connectionString })
// const prisma = new PrismaClient({ adapter })


dotenv.config();
const app = express();
const port = 5000;

app.use(sessionMiddlewere)
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));



app.use(express.json());

// app.get('/users', (req, res) => {
//     prisma.user.findMany({ orderBy: { id: 'asc' } }).then((users) => {
//         res.json(users)
//     })
// })

app.use('/auth', authRouter)

// await prisma.$connect();

async function start() {
    await prisma.$connect();
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}

start();

