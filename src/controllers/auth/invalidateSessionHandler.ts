import { Request, Response } from "express";

export function invalidateSessionHandler(req: Request, res: Response) {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  res.status(200).send();
}
