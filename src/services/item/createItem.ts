import prisma from "@prisma/index";

interface CreateItem {
  plaidId: string;
  userId: string;
  accessToken: string;
  institutionId?: string | null;
  institutionName?: string | null;
}

export async function createItem(item: CreateItem) {
  return await prisma.item.create({
    data: {
      ...item,
    },
  });
}
