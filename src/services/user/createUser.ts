import { hash } from "argon2";

import prisma from "@prisma/index";

export async function createUser(email: string, password: string) {
  return await prisma.user.create({
    data: {
      email,
      password: await hash(password),
    },
  });
}
