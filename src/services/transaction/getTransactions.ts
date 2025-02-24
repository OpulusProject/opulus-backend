import { Prisma } from "@prisma/client";

import prisma from "@prisma/index";

type OrderBy = {
  property: keyof Prisma.TransactionOrderByWithRelationInput;
  direction: "asc" | "desc";
};

type GetTransactionsFilters = {
  start: Date;
  userId: string;
  accountId?: string;
  itemId?: string;
  authorizedOnly?: boolean;
  orderBy?: OrderBy;
};

export async function getTransactions(filters: GetTransactionsFilters) {
  const { start, userId, accountId, itemId, authorizedOnly, orderBy } = filters;

  try {
    return await prisma.transaction.findMany({
      where: {
        ...(authorizedOnly && { authorizedDate: { not: null } }),
        authorizedDate: {
          gte: start,
        },
        account: {
          plaidId: accountId,
          item: {
            userId,
            plaidId: itemId,
          },
        },
      },
      orderBy: orderBy ? { [orderBy.property]: orderBy.direction } : undefined,
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(error.message);
    }
  }
}
