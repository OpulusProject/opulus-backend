import { User } from "@prisma/client";
import { Request, Response } from "express";

import { getItem } from "@services/item/getItem";

export async function getItemHandler(req: Request, res: Response) {
  const user = res.locals.user as User;
  const userId = user.id;

  const filters = req.query;

  try {
    const item = await getItem({ userId, ...filters });
    res.status(200).json(item);
  } catch (error) {
    console.error("Error fetching item:", error);
    res.status(500).json({
      message: "Could not fetch item",
      error: (error as Error).message,
    });
  }
}
