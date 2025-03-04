import { Prisma } from "@prisma/client";

import prisma from "@prisma/index";

export type GetItemFilters = {
  institutionId?: string;
} & (
  | { userId: string; plaidItemId?: never }
  | { userId?: never; plaidItemId: string }
);

export async function getItem(filters: GetItemFilters) {
  const { userId, plaidItemId, institutionId } = filters;

  try {
    const item = await prisma.item.findFirst({
      where: {
        userId,
        plaidId: plaidItemId,
        institutionId,
      },
      include: {
        accounts: {
          select: {
            availableBalance: true,
            currentBalance: true,
          },
        },
      },
    });

    if (!item) {
      return null;
    }

    return {
      ...item,
      availableBalance: item.accounts.reduce(
        (sum, acc) => sum + (acc.availableBalance || 0),
        0,
      ),
      currentBalance: item.accounts.reduce(
        (sum, acc) => sum + (acc.currentBalance || 0),
        0,
      ),
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(error.message);
    }
    throw error;
  }
}
