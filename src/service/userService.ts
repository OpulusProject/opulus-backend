import { User } from "@prisma/client";
import prisma from "@prisma/index";

export async function createUser(
  input: Pick<User, "firstName" | "lastName" | "email" | "password">
) {
  return await prisma.user.create({
    data: {
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      password: input.password,
    },
  });
}
