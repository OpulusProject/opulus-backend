import { User } from "@prisma/client";
import { Request, Response } from "express";
import { omit } from "lodash";

export function getCurrentUserHandler(req: Request, res: Response) {
  const user = res.locals.user as User;
  const payload = omit(user, user.password);
  res.send(payload);
}
