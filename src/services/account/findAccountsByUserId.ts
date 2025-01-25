import prisma from "@prisma/index";

// todo: this needs to receive its filters from query params
export async function findAccountsByUserId(userId: string) {
  return await prisma.account.findMany({
    where: {
      item: {
        userId,
      },
    },
  });
}
