import { verify } from "argon2";
import { Request, Response } from "express";

import { CreateSessionInput } from "@schema/authSchema";
import { findUserByEmail } from "@services/user/findUserByEmail";

import { issueTokens } from "./issueTokens";

export async function createSessionHandler(
  req: Request<object, object, CreateSessionInput>,
  res: Response,
) {
  const { email, password } = req.body;

  const user = await findUserByEmail(email);
  if (!user) {
    res.status(401).send("Invalid email or password.");
    return;
  }

  if (!user.password) {
    res.status(401).send("Invalid email or password.");
    return;
  }

  const isValid = await verify(user.password, password);
  if (!isValid) {
    res.status(401).send("Invalid email or password.");
    return;
  }

  issueTokens(res, user);
  res.status(200).send();
}
