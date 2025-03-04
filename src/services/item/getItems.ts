import prisma from "@prisma/index";

type GetItemsFilters = {
  userId: string;
};

export async function getItems(filters: GetItemsFilters) {
  const { userId } = filters;

  const items = await prisma.item.findMany({
    where: {
      userId,
    },
    include: {
      accounts: {
        select: {
          availableBalance: true,
          currentBalance: true,
        },
      },
    },
  });

  return items.map((item) => ({
    ...item,
    accounts: undefined,
    availableBalance: item.accounts.reduce(
      (sum, acc) => sum + (acc.availableBalance || 0),
      0,
    ),
    currentBalance: item.accounts.reduce(
      (sum, acc) => sum + (acc.currentBalance || 0),
      0,
    ),
  }));
}
