import { Router } from "express";
import authRouter from "@routes/authRoutes";
import userRouter from "@routes/userRoutes";

const router: Router = Router();

router.get("/healthcheck", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is healthy." });
});

router.use(authRouter);
router.use(userRouter);

export default router;
