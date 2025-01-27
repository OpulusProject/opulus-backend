import prisma from "@prisma/index";

type GetUserFilters = {
  userId?: string;
  email?: string;
};

export async function getUser(filters: GetUserFilters) {
  const { userId, email } = filters;

  if (userId) {
    return await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
  } else if (email) {
    return await prisma.user.findUnique({
      where: {
        email,
      },
    });
  } else {
    throw new Error("userId or email must be provided");
  }
}
