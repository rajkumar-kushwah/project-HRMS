import { prisma } from "../config/db.ts";
import { type Request, type Response } from "express";

// monthly attendance controller

export const getMonthlyAttendance = async (req: Request, res: Response) => {
    try {
        const month = Number(req.query.month); // get the month number from the query parameter
        const year = Number(req.query.year); // get the year from the query parameter

        const start = new Date(year, month - 1, 1); // set the start date to the first day of the month
        const end = new Date(year, month, 0, 23, 59, 59, 999); // set the end date to the last day of the month

        const attendance = await prisma.attendance.findMany({
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