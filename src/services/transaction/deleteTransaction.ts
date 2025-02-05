import prisma from "@prisma/index";

export async function deleteTransaction(plaidId: string) {
  try {
    return await prisma.transaction.delete({
      where: {
        plaidId,
      },
    });
  } catch (error) {
    console.error(`Failed to delete transaction: ${plaidId}`, error);
    throw error;
  }
}
