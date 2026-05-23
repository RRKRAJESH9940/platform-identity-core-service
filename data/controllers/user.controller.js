import {
  getClientWebhookInfoSchema,
  validateClientTokenSchema,
} from "../helpers/joi_validations/user.joi.js";
import { getClientWebhookHandler, validateClientTokenHandler } from "../services/user.service.js";
import {
  logActivity,
  updateActivityLogResponse,
} from "../helpers/loggers/activity/activity.log.js";
import { encrypt } from "../helpers/utils/encrypt.js";

export const getClientWebhook = async (req, res, next) => {
  try {
    // Raw request logging
    const activitylog = await logActivity(
      req,
      "GET_CLIENT_WEBHOOK",
      encrypt(JSON.stringify(req.body))
    );

    // Schematic validation
    const payload = await getClientWebhookInfoSchema.validateAsync(req.body);

    // Logic
    const result = await getClientWebhookHandler(
      payload,
      req.header("Authorization")
    );

    // Construct final response
    const finalResponse = {
      error: false,
      data: {
        webhook: result.webhook,
        webhookToken: result.webhookToken,
      },
    };

    const finalResponseEncrypted = {
      error: false,
      data: encrypt(JSON.stringify({ result })),
    };

    await updateActivityLogResponse(activitylog._id, finalResponseEncrypted);

    return res.status(200).json(finalResponse);
  } catch (error) {
    console.error("Error while processing the :: getClientWebhook()");
    next(error);
  }
};

export const validateClientToken = async (req, res, next) => {
  try {
    // Raw request logging
    const activitylog = await logActivity(
      req,
      "VALIDATE_CLIENT_TOKEN",
      encrypt(JSON.stringify(req.body))
    );

    // Schematic validation
    const payload = await validateClientTokenSchema.validateAsync(req.body);

    // Logic
    const result = await validateClientTokenHandler(
      payload,
      req.header("Authorization")
    );

    // Construct final response
    const finalResponse = {
      error: false,
      data: {
        isActive: !result.isDeleted,
        clientId: result._id,
      },
    };

    await updateActivityLogResponse(activitylog._id, finalResponse);

    return res.status(200).json(finalResponse);
  } catch (error) {
    console.error("Error while processing the :: getClientWebhook()");
    next(error);
  }
};
