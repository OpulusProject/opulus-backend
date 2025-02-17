import { Prisma } from "@prisma/client";

import prisma from "@prisma/index";
import { Account } from "src/types/Account/Account";

export async function createAccounts(accounts: Account[]) {
  try {
    return await prisma.account.createMany({
      data: accounts,
      skipDuplicates: true,
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(error.message);
    }
  }
}
