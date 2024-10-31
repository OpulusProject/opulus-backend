import { Account, Balance, Prisma } from "@prisma/client";
import prisma from "@prisma/index";

export async function createAccount(account: Account, balance: Omit<Balance, 'accountId'>) {
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
