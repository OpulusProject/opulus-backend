import { User } from "@prisma/client";
import prisma from "@prisma/index";
import { signJwt } from "@utils/jwt";
import { omit } from "lodash";

export async function createSession(userId: number) {
  return await prisma.session.create({
    data: {
      userId,
    },
  });
}

export async function findSessionById(id: number) {
  return await prisma.session.findUnique({
    where: {
      id,
    },
  });
}

export function signAccessToken(user: User) {
  const payload = omit(user, user.password);

  const accessToken = signJwt(payload, "accessTokenPrivateKey", {
    expiresIn: "15m",
  });

  return accessToken;
}

export async function signRefreshToken(userId: number) {
  const session = await createSession(userId);

  const refreshToken = signJwt(
    {
      session: session.id,
    },
    "refreshTokenPrivateKey",
    {
      expiresIn: "1y",
    }
  );

  return refreshToken;
}
