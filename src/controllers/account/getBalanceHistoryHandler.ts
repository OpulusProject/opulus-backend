import { User } from "@prisma/client";
import { Request, Response } from "express";

import { getBalanceHistory } from "@src/services/account/getBalanceHistory";

export async function getBalanceHistoryHandler(req: Request, res: Response) {
  const user = res.locals.user as User;
  const userId = user.id;

  const filters = req.query;
  try {
    const balanceHistory = await getBalanceHistory({ userId, ...filters });

    res.status(200).json({
      message: "Balance history retrieved successfully",
      data: balanceHistory,
    });
  } catch (error) {
    console.error("Unknown error retrieving balance history:", error);
    res.status(500).json({
      message: "Could not retrieve balance history",
      error: (error as Error).message,
    });
  }
}
