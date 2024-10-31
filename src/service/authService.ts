import { User } from "@prisma/client";
import { omit } from "lodash";

import { signJwt } from "@utils/jwt";

export function signAccessToken(user: User) {
  const payload = omit(user, user.password);

  const accessToken = signJwt(payload, "accessTokenPrivateKey", {
    expiresIn: "15m",
  });

  return accessToken;
}

export function signRefreshToken(user: User) {
  const refreshToken = signJwt({ id: user.id }, "refreshTokenPrivateKey", {
    expiresIn: "90d",
  });

  return refreshToken;
}
