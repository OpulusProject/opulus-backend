import { Account, Balance } from "@prisma/client";

import prisma from "@prisma/index";

export async function createAccount(
  account: Account,
  balance: Omit<Balance, "accountId">,
) {
  return await prisma.account.create({
    data: {
      ...account,
      balance: {
        create: {
          ...balance,
        },
      },
    },
  });
}

export async function findAccountsByUserId(userId: string) {
  return await prisma.account.findMany({
    where: {
      userId,
    },
  });
}
