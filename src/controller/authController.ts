import { Request, Response } from "express";
import { CreateSessionInput } from "@schema/authSchema";
import {
  findSessionById,
  signAccessToken,
  signRefreshToken,
  updateSession,
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
    res.status(401).send("Invalid email or password.");
    return;
  }

  const isValid = await argon2.verify(user.password, password);
  if (!isValid) {
    res.status(401).send("Invalid email or password.");
    return;
  }

  const accessToken = signAccessToken(user);
  const refreshToken = await signRefreshToken(user.id);

  res.status(200).send({ accessToken, refreshToken });
}

export async function refreshAccessTokenHandler(req: Request, res: Response) {
  const refreshToken = req.get("headers.x-refresh");
  if (!refreshToken) {
    res.status(400).send("Refresh token is missing.");
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

export async function invalidateSessionHandler(req: Request, res: Response) {
  const refreshToken = req.get("headers.x-refresh");
  if (!refreshToken) {
    res.status(400).send("Refresh token is missing.");
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

  await updateSession({ sessionId: decoded.session, valid: false });

  res.status(200).send("Logged out successfully.");
}
