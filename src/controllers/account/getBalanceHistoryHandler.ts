import { User } from "@prisma/client";
import { Request, Response } from "express";

import { getAccounts } from "@src/services/account/getAccounts";
import { getTransactions } from "@src/services/transaction/getTransactions";

export async function getBalanceHistoryHandler(req: Request, res: Response) {
  const user = res.locals.user as User;
  const userId = user.id;

  const filters = req.query;

  const today = new Date();

  // If startDate is not provided, default to 30 days before today
  const start = filters.startDate
    ? new Date(filters.startDate as string)
    : new Date(new Date().setDate(today.getDate() - 30));

  try {
    const accounts = await getAccounts({ userId, ...filters });

    if (!accounts) {
      res.status(404).json({
        message: "Could not find accounts",
      });
      return;
    }

    const currentBalance = accounts.reduce((acc, account) => {
      return acc + (account.availableBalance ?? 0);
    }, 0);

    const transactions = await getTransactions({
      start,
      userId,
      authorizedOnly: true,
      orderBy: { property: "authorizedDate", direction: "asc" },
      ...filters,
    });

    if (!transactions) {
      res.status(404).json({
        message: "Could not find transactions",
      });
      return;
    }

    // Determine the change in balance for each day
    const changeHistory = new Map<string, number>();

    transactions.map((transaction) => {
      const key = transaction.authorizedDate!.toISOString().split("T")[0];
      const value = changeHistory.get(key) ?? 0;
      changeHistory.set(key, value + transaction.amount);
    });

    const balanceHistory = [
      {
        date: today.toISOString().split("T")[0],
        balance: currentBalance,
      },
    ];

    let runningBalance = currentBalance;

    // Calculate the balance for each day
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    for (
      let date = yesterday;
      date >= start;
      date.setDate(date.getDate() - 1)
    ) {
      const key = date.toISOString().split("T")[0];
      const change = changeHistory.get(key) ?? 0;
      runningBalance -= change;

      balanceHistory.push({
        date: key,
        balance: Math.round(runningBalance * 100) / 100,
      });
    }

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
