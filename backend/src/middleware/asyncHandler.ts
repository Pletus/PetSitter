import { Request, Response, NextFunction } from "express";

export const asyncHandler =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    return fn(req, res, next).catch(next);
  };
