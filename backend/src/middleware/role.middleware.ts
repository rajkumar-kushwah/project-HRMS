


//  check Permissions


import { prisma } from "../config/db.ts";

// export const checkPermissions = (permissionName: string) => {
//     return async (req: any, res: any, next: any) => {
//         try {
//             // session for user id
//             const userId = req.session.userId;

//             if (!userId) {
//                 return res.status(401).json({ message: 'Unauthorized' })
//             }

//             const User = await prisma.user.findUnique({
//                 where: { id: userId },
//                 include: {
//                     roles: {
//                         include: {
//                             permissions: true
//                         }
//                     }
//                 }
//             });

//             if (!User) {
//                 return res.status(404).json({ message: 'User not found' });
//             }

//             //  Super-admin bypass 
//             const isSuperAdmin = User.roles.some((role: any) => role.name === 'SUPER_ADMIN');
//                    console.log("Admin logged in" + isSuperAdmin);
//             if (isSuperAdmin) {
//                 return next();
//             }

//             // permission cullect krna hai
//            const permissions = User.roles.flatMap((role)=> role.permissions.map((p)=> p.name))

//             // check permission
//             const hasPermission = permissions.includes(permissionName);

//             if (!hasPermission) {
//                 return res.status(403).json({ message: 'Forbidden' });
//             }

//             next();

//         } catch (error) {
//             console.log(error);
//             return res.status(500).json({ message: 'Server error' });
//         }
//     };
// };



export const checkPermissions = (permissionName: string) => {
  return (req: any, res: any, next: any) => {
    const permissions = req.session.permissions || [];
    const roles = req.session.roles || [];

    // SUPER ADMIN bypass
    if (roles.includes("SUPER_ADMIN")) {
      return next();
    }
    console.log("Session:", req.session);
    console.log("Roles:", req.session.roles);
    console.log("Permissions:", req.session.permissions);

    if (!permissions.includes(permissionName)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };
};