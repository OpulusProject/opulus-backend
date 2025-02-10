import { Prisma } from "@prisma/client";

import prisma from "@prisma/index";

interface GetLinkSession {
  linkToken: string;
}

export async function getLinkSession(linkSession: GetLinkSession) {
  const { linkToken } = linkSession;

  try {
    return await prisma.linkSession.findUnique({
      where: {
        linkToken,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(error.message);
    }
  }
}
