import { Prisma } from "@prisma/client";

import prisma from "@prisma/index";
import { Item } from "@src/types/Item/Item";

export async function createItem(item: Item) {
  try {
    return await prisma.item.create({
      data: item,
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(error.message);
    }
  }
}
