import { prisma } from "../config/db.ts";


export const getprofile = async (req: any, res: any) => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({ message: "User not logged in" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        lastLogin: true
      }
    });

    return res.json(user);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};


