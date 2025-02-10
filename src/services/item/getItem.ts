import prisma from "@prisma/index";

export type GetItemFilters = {
  userId?: string;
  plaidItemId?: string;
  institutionId?: string;
};

export async function getItem(filters: GetItemFilters) {
  const { userId, plaidItemId, institutionId } = filters;

  if (userId) {
    return await prisma.item.findFirst({
      where: {
        userId,
        institutionId,
      },
    });
  } else if (plaidItemId) {
    return await prisma.item.findFirst({
      where: {
        plaidId: plaidItemId,
        institutionId,
      },
    });
  } else {
    throw new Error("userId or plaidId must be provided");
  }
}
