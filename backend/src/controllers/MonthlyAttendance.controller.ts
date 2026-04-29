import { prisma } from "../config/db.ts";
import { type Request, type Response } from "express";

// monthly attendance controller

export const getMonthlyAttendance = async (req: Request, res: Response) => {
    try {
        const session: any = req.session;
        const userId = session?.userId;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const month = Number(req.query.month); // get the month number from the query parameter
        const year = Number(req.query.year); // get the year from the query parameter

        const start = new Date(year, month - 1, 1); // set the start date to the first day of the month
        const end = new Date(year, month, 0, 23, 59, 59, 999); // set the end date to the last day of the month

        // user + roles fetch

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                roles: {
                    select: {
                        name: true,
                    }
                }
            }
        })

        const roles = user?.roles?.map(r => r.name) || [];

        let attendance;

        if (roles.includes("SUPER_ADMIN") || roles.includes("HR")) {
            attendance = await prisma.attendance.findMany({
                where: {
                    checkIn: {
                        gte: start,
                        lte: end,
                    },
                },
                include: {
                    user: {
                        include: {
                            employee: {
                                include: {
                                    department: true,
                                },
                            },
                        },
                    },
                },
            });
        }
        else {
            attendance = await prisma.attendance.findMany({
                where: {
                     userId: userId,
                    checkIn: {
                        gte: start,
                        lte: end,
                    },
                },
                include: {
                    user: {
                        include: {
                            employee: {
                                include: {
                                    department: true,
                                },
                            },
                        },
                    },
                },
            });
        }



        return res.status(200).json({
            success: true,
            message: "Monthly attendance fetched successfully",
            data: attendance
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
}