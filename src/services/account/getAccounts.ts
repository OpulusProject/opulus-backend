import { Prisma } from "@prisma/client";

import prisma from "@prisma/index";

type GetAccountsFilters = {
  userId: string;
  accountId?: string;
  itemId?: string;
};

export async function getAccounts(filters: GetAccountsFilters) {
  const { userId, accountId, itemId } = filters;

  try {
    return await prisma.account.findMany({
      where: {
        plaidId: accountId,
        item: {
          userId,
          plaidId: itemId,
        },
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(error.message);
    }
  }
}
