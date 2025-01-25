import prisma from "@prisma/index";

export type GetItemsFilters = {
  institutionId?: string;
};

export async function getItem(userId: string, filters: GetItemsFilters) {
  const { institutionId } = filters;

  return await prisma.item.findFirst({
    where: {
      userId,
      institutionId,
    },
  });
}
