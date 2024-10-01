import { Router, Request, Response } from "express";
import userRouter from "./userRoutes";

const router: Router = Router();

router.get("/healthcheck", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is healthy" });
});

router.use(userRouter);

export default router;
