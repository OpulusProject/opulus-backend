import { Request, Response } from "express";
import { CreateSessionInput } from "@schema/authSchema";
import {
  findSessionById,
  signAccessToken,
  signRefreshToken,
} from "@service/authService";
import { findUserByEmail, findUserById } from "@service/userService";
import argon2 from "argon2";
import { verifyJwt } from "@utils/jwt";

export async function createSessionHandler(
  req: Request<{}, {}, CreateSessionInput>,
  res: Response
) {
  const { email, password } = req.body;

  const user = await findUserByEmail(email);
  if (!user) {
    res.send("User does not exist.");
    return;
  }

  const isValid = argon2.verify(user.password, password);
  if (!isValid) {
    res.send("Password is invalid.");
    return;
  }

  const accessToken = signAccessToken(user);
  const refreshToken = await signRefreshToken(user.id);

  res.send({ accessToken, refreshToken });
}

export async function refreshAccessTokenHandler(req: Request, res: Response) {
  const refreshToken = req.get("headers.x-refresh");
  if (!refreshToken) {
    res.send("Refresh token is missing.");
    return;
  }

  const decoded = verifyJwt<{ session: number }>(
    refreshToken,
    "refreshTokenPublicKey"
  );
  if (!decoded) {
    res.status(401).send("Refresh token is invalid.");
    return;
  }

  const session = await findSessionById(decoded.session);
  if (!session || !session.valid) {
    res.status(401).send("Session is invalid.");
    return;
  }

  const user = await findUserById(session.userId);
  if (!user) {
    res.status(401).send("User does not exist.");
    return;
  }

  const accessToken = signAccessToken(user);
  res.send({ accessToken });
}
