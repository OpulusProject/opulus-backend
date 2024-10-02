import { User } from "@prisma/client";
import prisma from "@prisma/index";
import argon2 from "argon2";

export async function createUser(
  input: Pick<User, "firstName" | "lastName" | "email" | "password">
) {
  return await prisma.user.create({
    data: {
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      password: await argon2.hash(input.password),
    },
  });
}

export async function findUserById(input: Pick<User, "id">) {
  return await prisma.user.findUnique({
    where: {
      id: input.id,
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
