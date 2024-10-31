import argon2 from "argon2";

import prisma from "@prisma/index";

export async function createUser(email: string, password: string) {
  return await prisma.user.create({
    data: {
      email,
      password: await argon2.hash(password),
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

export async function findUserById(id: number) {
  return await prisma.user.findUnique({
    where: {
      id,
    },
  });
}
