import { User } from "@prisma/client";
import { Response } from "express";

import { signAccessToken } from "@services/auth/signAccessToken";
import { signRefreshToken } from "@services/auth/signRefreshToken";

// todo: move these to a config/env file
const ACCESS_TOKEN_MAX_AGE = 1000 * 60 * 15; // 15 min
const REFRESH_TOKEN_MAX_AGE = 1000 * 60 * 60 * 24 * 30; // 30 days

export function issueTokens(res: Response, user: User) {
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    maxAge: ACCESS_TOKEN_MAX_AGE,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: REFRESH_TOKEN_MAX_AGE,
  });
}
