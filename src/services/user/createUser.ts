import { Prisma } from "@prisma/client";
import { hash } from "argon2";

import prisma from "@prisma/index";

export async function createUser(
  email: string,
  password?: string,
  additionalData?: Partial<Prisma.UserCreateInput>,
) {
  const hashedPassword = password ? await hash(password) : undefined;
  return await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      ...additionalData,
    },
  });
}
