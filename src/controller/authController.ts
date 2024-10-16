import { Request, Response } from "express";
import { CreateSessionInput } from "@schema/authSchema";
import { signAccessToken, signRefreshToken } from "@service/authService";
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
  const refreshToken = signRefreshToken(user);

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    maxAge: 1000 * 60 * 15,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 90,
  });

  res.status(200).send();
}

export async function invalidateSessionHandler(req: Request, res: Response) {
   res.cookie("accessToken", "", {
     httpOnly: true,
     expires: new Date(0),
   });

   res.cookie("refreshToken", "", {
     httpOnly: true,
     expires: new Date(0),
   });

   res.status(200).send();
}

export async function refreshAccessTokenHandler(req: Request, res: Response) {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    res.status(400).send("Refresh token is missing.");
    return;
  }

  const decoded = verifyJwt<{ id: number }>(
    refreshToken,
    "refreshTokenPublicKey"
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

  const accessToken = signAccessToken(user);

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    maxAge: 1000 * 60 * 15,
  });

  res.status(200).send();
}