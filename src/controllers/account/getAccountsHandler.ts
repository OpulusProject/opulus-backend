import { User } from "@prisma/client";
import { Request, Response } from "express";

import { findAccountsByUserId } from "@services/account/findAccountsByUserId";

export async function getAccountsHandler(req: Request, res: Response) {
  const user = res.locals.user as User;
  try {
    const accounts = await findAccountsByUserId(user.id);
    res.status(200).json({
      message: "Accounts retrieved successfully",
      accounts,
    });
  } catch (error) {
    console.error("Unknown error getting accounts:", error);
    res.status(500).json({
      message: "Could not get accounts",
      error: (error as Error).message,
    });
  }
}
