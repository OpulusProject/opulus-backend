import { Request, Response } from "express";
import { CreateSessionInput } from "@schema/authSchema";
import { findUserByEmail } from "@service/userService";
import argon2 from "argon2";

export async function createSessionHandler(
  req: Request<{}, {}, CreateSessionInput>,
  res: Response
) {
  const { email, password } = req.body;

  const user = await findUserByEmail(email);
  if (!user) {
    return res.send("User not found.");
  }

  const isValid = argon2.verify(user.password, password)
}
