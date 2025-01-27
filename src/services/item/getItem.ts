import prisma from "@prisma/index";

export type GetItemsFilters = {
  userId: string;
  institutionId?: string;
};

export async function getItem(filters: GetItemsFilters) {
  const { userId, institutionId } = filters;

  return await prisma.item.findFirst({
    where: {
      userId,
      institutionId,
    },
  });
}
