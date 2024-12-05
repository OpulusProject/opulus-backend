import { User } from "@prisma/client";

import { signJwt } from "@utils/jwt";

export function signRefreshToken(user: User) {
  const refreshToken = signJwt({ id: user.id }, "refreshTokenPrivateKey", {
    expiresIn: "90d",
  });

  return refreshToken;
}
