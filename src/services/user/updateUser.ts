import { hash } from "argon2";

import prisma from "@prisma/index";

enum OnboardingStatus {
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}

interface UpdateUser {
  id: string;
  plaidId?: string;
  plaidUserToken?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  onboardingStatus?: OnboardingStatus;
}

export async function updateUser(user: UpdateUser) {
  if (user.password) {
    user.password = await hash(user.password);
  }

  return await prisma.user.update({
    where: { id: user.id },
    data: {
      ...user,
    },
  });
}
