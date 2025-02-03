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
  return await prisma.account.create({
    data: {
      ...account,
    },
  });
}
