// import type { Request, Response, NextFunction } from "express";
// import jwt from "jsonwebtoken";

// export const protect = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   let token: string | undefined;

//   //  Check Authorization Header
//   if (req.headers.authorization?.startsWith("Bearer ")) {
//     token = req.headers.authorization.split(" ")[1];
//   }

//   // Agar token nahi mila
//   if (!token) {
//     return res.status(401).json({
//       message: "Not authorized, no token",
//     });
//   }

//   try {
//     //  Verify Token
//     const decoded = jwt.verify(
//       token,
//       process.env.JWT_SECRET as string
//     );


//     //  Attach user to request
//     (req as any).user = decoded;

//     next();
//   } catch (error) {
//     return res.status(401).json({
//       message: "Not authorized, token failed",
//     });
//   }
// };





import type { Request, Response, NextFunction } from "express";

export const protect = (req: Request, res: Response, next: NextFunction) => {
  if (!(req.session as any).userId){
    return res.status(401).json({ message: "Not authorized" });
  }
  next();
}
