import { User } from "@prisma/client";
import { Request, Response } from "express";

export function getUserHandler(req: Request, res: Response) {
  const user = res.locals.user as User;
  // todo: test if this doesnt send password
  res.send(user);
}
