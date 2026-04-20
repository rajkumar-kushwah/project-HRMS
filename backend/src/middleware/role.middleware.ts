


//  check Permissions


import { prisma } from "../config/db.ts";


// export const checkPermissions = (permissionName: string) => {
//   return (req: any, res: any, next: any) => {
//     const permissions = req.session.permissions || [];
//     const roles = req.session.roles || [];

//     // SUPER ADMIN bypass
//     if (roles.includes("SUPER_ADMIN")) {
//       return next();
//     }
//     console.log("Session:", req.session);
//     console.log("Roles:", req.session.roles);
//     console.log("Permissions:", req.session.permissions);

//     if (!permissions.includes(permissionName)) {
//       return res.status(403).json({ message: "Forbidden" });
//     }

//     next();
//   };
// };



export const checkPermissions = (permissionName: string) => {
  return (req: any, res: any, next: any) => {

    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // roles extract karo
    const roles = user.roles.map((r: any) => r.name);

    // SUPER_ADMIN bypass
    if (roles.includes("SUPER_ADMIN")) {
      return next();
    }

    // permissions extract karo
    const permissions = user.roles.flatMap((role: any) =>
      role.permissions.map((p: any) => p.name)
    );

    if (!permissions.includes(permissionName)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };
};
