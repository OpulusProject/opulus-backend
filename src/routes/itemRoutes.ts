import { Router } from "express";

import { getItemHandler } from "@controllers/item/getItemHandler";
import requireUser from "@middleware/requireUser";

const itemRouter = Router();

itemRouter.get("/item", requireUser, getItemHandler);

export default itemRouter;
