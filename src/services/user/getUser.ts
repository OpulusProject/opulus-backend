import prisma from "@prisma/index";

export type GetUserFilters = {
  email?: string;
};

export async function getUser(userId: string, filters?: GetUserFilters) {
  const { email } = filters || {};

  return await prisma.user.findUnique({
    where: {
      id: userId,
      email,
    },
  });
}
