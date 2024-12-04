import prisma from "@prisma/index";

export async function findUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
}
