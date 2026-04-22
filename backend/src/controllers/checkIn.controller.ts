import type { Request, Response } from "express";
import { prisma } from "../config/db.ts";

// check in controller

export const checkIn = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).session?.userId;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const now = new Date();

        // today range
        const start = new Date();
        start.setHours(0, 0, 0, 0);

        const end = new Date();
        end.setHours(23, 59, 59, 999);

        //  check already checked in today
        const existing = await prisma.attendance.findFirst({
            where: {
                userId,
                checkIn: {
                    gte: start,
                    lte: end,
                },
            },
        });

        if (existing) {
            return res.status(400).json({ message: "Already checked in today" });
        }

        //  office time logic
        const officeTime = new Date();
        officeTime.setHours(9, 30, 0, 0);

        const status = now > officeTime ? "Late" : "Early";

        // create entry
        const attendance = await prisma.attendance.create({
            data: {
                userId,
                date: now,       //  fix (no mismatch)
                checkIn: now,
                status,
            },
        });

        res.status(200).json({
            message: "Check in successful",
            data: attendance,
        });

    } catch (error) {
        console.error("CHECKIN ERROR:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// check out controller

export const checkOut = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).session?.userId;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const now = new Date();

        //  find active check-in (no checkout yet)
        const attendance = await prisma.attendance.findFirst({
            where: {
                userId,
                checkOut: null, //  important
            },
            orderBy: {
                checkIn: "desc",
            },
        });

        if (!attendance || !attendance.checkIn) {
            return res.status(400).json({ message: "Invalid check-in data" });
        }

        // calculate duration
        const diffMs = now.getTime() - attendance.checkIn!.getTime();

        const hours = diffMs / (1000 * 60 * 60);

        const totalHours = +hours.toFixed(2);
        const overtime = totalHours > 8 ? +(totalHours - 8).toFixed(2) : 0;

        //  update
        const updated = await prisma.attendance.update({
            where: { id: attendance.id },
            data: {
                checkOut: now,
                totalHours,
                overtime,
            },
        });

        res.status(200).json({
            message: "Check out successful",
            data: updated,
        });

    } catch (error) {
        console.error("CHECKOUT ERROR:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// get attendance
export const getAttendance = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).session?.userId;

    console.log("SESSION:", req.session);
    console.log("USERID:", userId);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const data = await prisma.attendance.findMany({
      where: { userId },
      orderBy: { date: "desc" }
    });

    return res.status(200).json({
      message: "Attendance fetched successfully",
      data
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

