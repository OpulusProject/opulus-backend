import { Prisma } from "@prisma/client";

import prisma from "@prisma/index";

interface CreateAccount {
  plaidId: string;
  itemId: string;
  mask?: string | null;
  name?: string;
  officialName?: string | null;
  type: string;
  subtype?: string | null;
  availableBalance?: number | null;
  currentBalance?: number | null;
  limit?: number | null;
  currencyCode?: string | null;
}

export async function createAccount(account: CreateAccount) {
  try {
    return await prisma.account.create({
      data: {
        ...account,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(error.message);
    }
  }
}
