import { Prisma } from "@prisma/client";

import prisma from "@prisma/index";

interface UpdateTransaction {
  plaidId: string;
  accountId: string;
  amount: number;
  currencyCode?: string | null;
  pending: boolean;
  date: string;
  authorizedDate?: string | null;
  paymentChannel: string;
  transactionCode?: string | null;
  address?: string | null;
  city?: string | null;
  region?: string | null;
  postalCode?: string | null;
  country?: string | null;
  name: string;
  merchantName?: string | null;
  logoURL?: string | null;
  website?: string | null;
}

export async function updateTransaction(transaction: UpdateTransaction) {
  try {
    return await prisma.transaction.update({
      where: {
        plaidId: transaction.plaidId,
      },
      data: {
        ...transaction,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(error.message);
    }
  }
}
