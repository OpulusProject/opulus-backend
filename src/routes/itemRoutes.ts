import { Router } from "express";

import { getItemHandler } from "@controllers/item/getItemHandler";
import { getItemsHandler } from "@controllers/item/getItemsHandler";
import requireUser from "@middleware/requireUser";

const itemRouter = Router();

itemRouter.get("/item", requireUser, getItemHandler);
itemRouter.get("/items", requireUser, getItemsHandler);

export default itemRouter;
