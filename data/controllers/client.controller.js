import {
  clientTokenRequestSchema,
  clientWebhookUpdateSchema,
} from "../helpers/joi_validations/client.joi.js";
import {
  logActivity,
  updateActivityLogResponse,
} from "../helpers/loggers/activity/activity.log.js";
import { encrypt } from "../helpers/utils/encrypt.js";
import {
  updateWebhookHanlder,
  clientTokenGenerationHandler,
} from "../services/client.service.js";

export const generateClientToken = async (req, res, next) => {
  try {
    // Raw request logging
    const activitylog = await logActivity(
      req,
      "GENERATE_CLIENT_TOKEN",
      encrypt(JSON.stringify(req.body))
    );

    // Schematic validation
    const payload = await clientWebhookUpdateSchema.validateAsync(req.body);

    // Data fields extraction
    const { userId, password } = payload;

    // Logic
    const token = await clientTokenGenerationHandler(userId, password, res);

    // Construct final response
    const finalResponse = {
      error: false,
      data: { token: token },
    };

    const finalResponseEncrypted = {
      error: false,
      data: encrypt(JSON.stringify({ token: token })),
    };

    // const expiryTime = 24 * 60 * 60 * 1000; // 24 h
    // res.cookie("token", `Bearer ${token}`, {
    //   httpOnly: true,
    //   expires: new Date(Date.now() + 1 * expiryTime),
    // });

    // Update response in log
    await updateActivityLogResponse(activitylog._id, finalResponseEncrypted);

    return res.status(200).json(finalResponse);
  } catch (error) {
    console.error(
      "Error while generating client token :: generateClientToken()"
    );
    next(error);
  }
};

export const clientWebhookUpdate = async (req, res, next) => {
  try {
    // Raw request logging
    const activitylog = await logActivity(
      req,
      "CLIENT_WEBHOOK_UPDATE",
      encrypt(JSON.stringify(req.body))
    );

    // Schematic validation
    const payload = await clientWebhookUpdateSchema.validateAsync(req.body);

    // Logic
    const result = await updateWebhookHanlder(
      payload,
      req.header("Authorization")
    );

    // Construct final response
    const finalResponse = {
      error: false,
      data: {
        clientId: result._id,
        message: "Webhook updated successfully",
      },
    };
    // const expiryTime = 24 * 60 * 60 * 1000; // 24 h
    // res.cookie("token", `Bearer ${token}`, {
    //   httpOnly: true,
    //   expires: new Date(Date.now() + 1 * expiryTime),
    // });

    // Update response in log
    await updateActivityLogResponse(activitylog._id, finalResponse);

    return res.status(200).json(finalResponse);
  } catch (error) {
    console.error("Error while processing the :: clientWebhookUpdate()");
    next(error);
  }
};
