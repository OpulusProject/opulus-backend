import prisma from "@prisma/index";

type GetBalanceHistoryFilters = {
  userId: string;
  itemId?: string;
  accountId?: string;
  startDate?: string;
};

export async function getBalanceHistory(filters: GetBalanceHistoryFilters) {
  const { userId, itemId, accountId, startDate } = filters;

  const transactions = await prisma.transaction.findMany({
    where: {
      authorizedDate: {
        not: null,
        gte: startDate ? new Date(startDate) : undefined,
      },
      account: {
        plaidId: accountId,
        item: {
          userId,
          plaidId: itemId,
        },
      },
    },
    orderBy: {
      authorizedDate: "desc",
    },
    select: {
      amount: true,
      authorizedDate: true,
    },
  });

  // TODO: Add balance calculation logic here

  return transactions;
}
