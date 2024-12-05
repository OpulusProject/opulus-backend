import { Prisma } from "@prisma/client";
import { hash } from "argon2";

import prisma from "@prisma/index";

export async function updateUser(
  userId: string,
  updates: Partial<Prisma.UserUpdateInput>,
) {
  if (updates.password) {
    updates.password = await hash(updates.password as string);
  }

  return await prisma.user.update({
    where: { id: userId },
    data: updates,
  });
}
