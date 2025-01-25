import { User } from "@prisma/client";
import { Request, Response } from "express";

import { getItem } from "@services/item/getItem";

export async function getItemHandler(req: Request, res: Response) {
  const user = res.locals.user as User;
  const filters = req.query;

  try {
    const item = await getItem(user.id, filters);
    res.status(200).json(item);
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({
      message: "Could not fetch items",
      error: (error as Error).message,
    });
  }
}
