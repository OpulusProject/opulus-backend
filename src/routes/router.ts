import { Router } from "express";

import accountRouter from "@routes/accountRoutes";
import authRouter from "@routes/authRoutes";
import plaidRouter from "@routes/plaidRoutes";
import userRouter from "@routes/userRoutes";

const router: Router = Router();

router.get("/healthcheck", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is healthy." });
});

router.use(accountRouter);
router.use(authRouter);
router.use(plaidRouter);
router.use(userRouter);

export default router;
