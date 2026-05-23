import { Router } from "express";
const userRouter = Router();

import { verifyToken } from "../middlewares/auth.middleware.js";

import { getClientWebhook, validateClientToken } from "../controllers/user.controller.js";

userRouter.post("/validateClientToken", verifyToken, validateClientToken)
userRouter.post("/getClientWebhook", verifyToken, getClientWebhook);

export default userRouter;
