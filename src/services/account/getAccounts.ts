import prisma from "@prisma/index";

type GetAccountsFilters = {
  userId: string;
};

export async function getAccounts(filters: GetAccountsFilters) {
  const { userId } = filters;

  return await prisma.account.findMany({
    where: {
      item: {
        userId,
      },
    },
  });
}
