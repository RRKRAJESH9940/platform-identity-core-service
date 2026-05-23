import { Router } from "express";
const clientRouter = Router();

import { verifyToken } from "../middlewares/auth.middleware.js";

import {
  generateClientToken,
  clientWebhookUpdate,
} from "../controllers/client.controller.js";

clientRouter.post("/generateToken", generateClientToken);
clientRouter.post("/updateWebhook", verifyToken, clientWebhookUpdate);
export default clientRouter;
