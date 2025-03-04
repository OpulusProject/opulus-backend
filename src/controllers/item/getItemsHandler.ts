import { User } from "@prisma/client";
import { Request, Response } from "express";

import { getItems } from "@services/item/getItems";

export async function getItemsHandler(req: Request, res: Response) {
  const user = res.locals.user as User;
  const userId = user.id;

  const filters = req.query;

  try {
    const items = await getItems({ userId, ...filters });
    res.status(200).json(items);
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({
      message: "Could not fetch items",
      error: (error as Error).message,
    });
  }
}
