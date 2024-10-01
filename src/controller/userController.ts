import { Request, Response } from "express";
import { CreateUserInput } from "@/schema/userSchema";
import { createUser } from "@/service/userService";
import { Prisma } from "@prisma/client";

export async function createUserHandler(
  req: Request<{}, {}, CreateUserInput>,
  res: Response
) {
  const body = req.body;

  try {
    const user = await createUser(body);
    return res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (e: any) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        return res.status(409).json({
          error: "Account already exists",
        });
      }
    }

    return res.status(500).json({
      error: "An unexpected error occurred",
      details: e.message,
    });
  }
}
