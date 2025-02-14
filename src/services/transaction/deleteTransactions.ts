import { Prisma } from "@prisma/client";

import prisma from "@prisma/index";

export async function deleteTransactions(plaidId: string[]) {
  try {
    return await prisma.transaction.deleteMany({
      where: {
        plaidId: {
          in: plaidId,
        },
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(error.message);
    }
  }
}
