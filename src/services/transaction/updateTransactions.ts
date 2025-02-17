import { Prisma } from "@prisma/client";

import prisma from "@prisma/index";
import { Transaction } from "@src/types/Transaction/Transaction";

export async function updateTransactions(transactions: Transaction[]) {
  try {
    return await prisma.transaction.updateMany({
      data: transactions,
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(error.message);
    }
  }
}
