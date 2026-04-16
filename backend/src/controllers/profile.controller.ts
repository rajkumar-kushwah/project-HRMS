import { prisma } from "../config/db.ts";


// export const getprofile = async (req: any, res: any) => {
//   try {
//     const userId = req.session.userId;

//     if (!userId) {
//       return res.status(401).json({ message: "User not logged in" });
//     }

//     const user = await prisma.user.findUnique({
//       where: { id: userId },
//       select: {
//         id: true,
//         name: true,
//         email: true,
//         createdAt: true,
//         lastLogin: true
//       }
//     });

//     return res.json(user);

//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Server error" });
//   }
// };



export const getprofile = async (req: any, res: any) => {
  try {
    const userId = req.session.userId;

    //  check login
    if (!userId) {
      return res.status(401).json({
        message: "User not logged in",
      });
    }

    //  fetch user with roles
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        roles: true, //  IMPORTANT
      },
    });

    // user not found
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // clean response
    
    const firstRole = user.roles?.[0];

    return res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,

      role: firstRole
        ? {
          id: firstRole.id,
          name: firstRole.name,
        }
        : null,
    });
  } catch (error) {
    console.error("GET PROFILE ERROR:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};