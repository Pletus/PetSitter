import { Request, Response, NextFunction } from "express";

export function checkPassword(req: Request, res: Response, next: NextFunction): void {
    const password = req.headers["x-access-password"] as string;
  
    if (password && password === process.env.PROTECTED_PASSWORD) {
      next();
    } else {
      res.status(403).json({ error: "Contraseña incorrecta" });
    }
  }