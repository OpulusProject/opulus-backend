import { Request, Response } from "express";

import { findUserById } from "@services/user/findUserById";
import { verifyJwt } from "@utils/jwt";

import { issueTokens } from "./issueTokens";

export async function refreshAccessTokenHandler(req: Request, res: Response) {
  const refreshToken = req.cookies.refreshToken as string;
  if (!refreshToken) {
    res.status(400).send("Refresh token is missing.");
    return;
  }

  const decoded = verifyJwt<{ id: string }>(
    refreshToken,
    "refreshTokenPublicKey",
  );
  if (!decoded) {
    res.status(401).send("Refresh token is invalid.");
    return;
  }

  const user = await findUserById(decoded.id);
  if (!user) {
    res.status(401).send("User does not exist.");
    return;
  }

  issueTokens(res, user);
  res.status(200).send();
}
