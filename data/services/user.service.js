import { extractTokenInfo } from "./auth.service.js";
import CustomError from "../helpers/errors/custom_error.js";
import { Types } from "mongoose";
import userModel from "../models/user.model.js";
import clientModel from "../models/client.model.js";
import clientWebhookModel from "../models/client_webhook.model.js";

export const getClientWebhookHandler = async (payload, token) => {
  try {
    const tokenInfo = extractTokenInfo(token);

    if (!tokenInfo.userId) {
      throw new CustomError(
        "Invalid user token used for getting the client webhook info",
        401
      );
    }

    const userId = tokenInfo.userId;

    const userData = await userModel.findOne({
      _id: new Types.ObjectId(userId),
    });

    if (!userData) {
      throw new CustomError("No user found for the given request", 409);
    }

    const clientWebhookData = await clientWebhookModel.findOne({
      clientId: new Types.ObjectId(payload.clientId),
    });

    if (!clientWebhookData){
      throw new CustomError("webhook data not found for the requested client")
    }

    let webhook;
    let webhookToken;
    if (["ENRICHMENT_USER", "ADMIN"].includes(userData.role)) {
      webhook = clientWebhookData.enrichmentWebhook;
      webhookToken = clientWebhookData.enrichmentWebhookToken;
    } else {
      throw new CustomError(
        "The given user is unable to retrieve the webhook information."
      );
    }

    return {
      webhook,
      webhookToken,
    };
  } catch (error) {
    console.error(
      "Error while getting the webhook handler :: getClientWebhookHandler()",
      error
    );
    throw error;
  }
};

export const validateClientTokenHandler = async (payload, token) => {
  try {
    const tokenInfo = extractTokenInfo(token);

    if (!tokenInfo.userId) {
      throw new CustomError("Invalid user token used", 401);
    }

    const inputTokenInfo = extractTokenInfo(payload.token);

    if (!inputTokenInfo.clientId) {
      throw new CustomError("Invalid client token used", 409)
    }

    const clientData = await clientModel.findOne({
      _id: new Types.ObjectId(inputTokenInfo.clientId),
    });

    if (!clientData) {
      throw new CustomError("No client found", 409);
    }

    // Return updated document
    return await clientModel.findOne({
      _id: new Types.ObjectId(inputTokenInfo.clientId),
    });
  } catch (error) {
    console.error(
      "Error while handling update subscription request :: updateWebhookHanlder()",
      error
    );
    throw error;
  }
};
