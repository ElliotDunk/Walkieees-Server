import { Request, Response, NextFunction } from "express";

export default function (req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) return next();
  if (!req.isAuthenticated()) return res.status(403).json();
  return res.status(500).json();
}
