
import type { Request, Response, NextFunction } from "express";

export const protect = (req: Request, res: Response, next: NextFunction) => {
  if (!(req.session as any).userId){
    return res.status(401).json({ message: "Not authorized" });
  }
  next();
}
