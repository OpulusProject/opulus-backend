import { Prisma, User } from "@prisma/client";
import { Request, Response } from "express";
import { omit } from "lodash";

import { CreateUserInput } from "@schema/userSchema";
import { createUser } from "@service/userService";

export async function createUserHandler(
  req: Request<object, object, CreateUserInput>,
  res: Response,
): Promise<void> {
  const { email, password } = req.body;

  try {
    const user = await createUser(email, password);
    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        res.status(409).json({
          error: "Account already exists.",
        });
        return;
      }
    }

    res.status(500).json({
      error: "An unexpected error occurred.",
      details: (e as Error).message,
    });
  }
}

export function getCurrentUserHandler(req: Request, res: Response) {
  const user = res.locals.user as User;
  const payload = omit(user, user.password);
  res.send(payload);
}
