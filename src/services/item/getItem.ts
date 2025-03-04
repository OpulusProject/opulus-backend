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
    return await prisma.item.findFirst({
      where: {
        userId,
        plaidId: plaidItemId,
        institutionId,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(error.message);
    }
    throw error;
  }
}
