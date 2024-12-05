import prisma from "@prisma/index";

export async function findUserById(id: string) {
  return await prisma.user.findUnique({
    where: {
      id,
    },
  });
}
