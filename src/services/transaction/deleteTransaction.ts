import { Prisma } from "@prisma/client";

import prisma from "@prisma/index";

export async function deleteTransaction(plaidId: string) {
  try {
    return await prisma.transaction.delete({
      where: {
        plaidId,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(error.message);
    }
  }
}
