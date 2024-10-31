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

export async function findUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
}

export async function findUserById(id: string) {
  return await prisma.user.findUnique({
    where: {
      id,
    },
  });
}
