import { User } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

const requireUser = (req: Request, res: Response, next: NextFunction) => {
  const user = res.locals.user as User;

  if (!user) {
    res.sendStatus(403);
    return;
  }

  next();
};

export default requireUser;
