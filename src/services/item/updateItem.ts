import prisma from "@prisma/index";

interface UpdateItem {
  plaidId: string;
  accessToken: string;
  institutionId?: string | null;
  institutionName?: string | null;
  requiresUpdate?: boolean;
}

export async function updateItem(item: UpdateItem) {
  return await prisma.item.update({
    where: {
      plaidId: item.plaidId,
    },
    data: {
      ...item,
    },
  });
}
