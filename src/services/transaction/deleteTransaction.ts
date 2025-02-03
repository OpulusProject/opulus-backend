import prisma from "@prisma/index";

export async function deleteTransaction(plaidId: string) {
  return await prisma.transaction.delete({
    where: {
      plaidId,
    },
  });
}
