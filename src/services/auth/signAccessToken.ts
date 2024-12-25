import { User } from "@prisma/client";
import { omit } from "lodash";

import { signJwt } from "@utils/jwt";

export function signAccessToken(user: User) {
  const payload = omit(user, "password");

  const accessToken = signJwt(payload, "accessTokenPrivateKey", {
    expiresIn: "15m",
  });

  return accessToken;
}
