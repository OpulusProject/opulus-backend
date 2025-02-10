import { Prisma } from "@prisma/client";

import prisma from "@prisma/index";

interface CreateLinkSession {
  userId: string;
  linkToken: string;
}

export async function createLinkSession(linkSession: CreateLinkSession) {
  try {
    return await prisma.linkSession.create({
      data: {
        ...linkSession,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(error.message);
    }
  }
}
