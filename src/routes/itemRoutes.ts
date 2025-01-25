import { Router } from "express";

import { createItemHandler } from "@controllers/item/createItemHandler";
import { getItemHandler } from "@controllers/item/getItemHandler";
import requireUser from "@middleware/requireUser";

const itemRouter = Router();

itemRouter.post("/item", requireUser, createItemHandler);

itemRouter.get("/item", requireUser, getItemHandler);

export default itemRouter;
