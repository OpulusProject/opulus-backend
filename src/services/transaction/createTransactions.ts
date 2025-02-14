import { Prisma } from "@prisma/client";

import prisma from "@prisma/index";
import { Transaction } from "@src/types/Transaction/Transaction";

export async function createTransactions(transactions: Transaction[]) {
  try {
    return await prisma.transaction.createMany({
      data: transactions,
      skipDuplicates: true,
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(error.message);
    }
  }
}
