import prisma from "@prisma/index";

export async function findAccountsByUserId(userId: string) {
  return await prisma.account.findMany({
    where: {
      userId,
    },
  });
}
