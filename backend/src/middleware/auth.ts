import { Request, Response, NextFunction, RequestHandler } from 'express';

const requireAuth: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({ message: "Not logged in" });
    return; 
  }
  next();
};

export { requireAuth };