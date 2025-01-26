import { verify } from "argon2";
import { Request, Response } from "express";

import { LoginInput } from "@schema/authSchema";
import { getUser } from "@services/user/getUser";

import { issueTokens } from "./issueTokens";

export async function loginHandler(
  req: Request<object, object, LoginInput>,
  res: Response,
) {
  const { email, password } = req.body;

  const user = await getUser({ email });
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
