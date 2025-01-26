import prisma from "@prisma/index";

export async function getAccounts(userId: string) {
  return await prisma.account.findMany({
    where: {
      item: {
        userId,
      },
    },
  });
}
