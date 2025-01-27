import { User } from "@prisma/client";
import { Request, Response } from "express";

import { getAccounts } from "@services/account/getAccounts";

export async function getAccountsHandler(req: Request, res: Response) {
  const user = res.locals.user as User;
  const userId = user.id;
  try {
    const accounts = await getAccounts({ userId });
    res.status(200).json(accounts);
  } catch (error) {
    console.error("Error fetching accounts:", error);
    res.status(500).json({
      message: "Could not get accounts",
      error: (error as Error).message,
    });
  }
}
