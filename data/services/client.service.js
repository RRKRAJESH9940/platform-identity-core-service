import { extractTokenInfo } from "./auth.service.js";
import CustomError from "../helpers/errors/custom_error.js";
import clientWebhookModel from "../models/client_webhook.model.js";
import clientModel from "../models/client.model.js";
import { Types } from "mongoose";


export const clientTokenGenerationHandler = async (userId, password, res) => {
  try {
    // client retrieval
    let client = await clientModel.findOne({ clientName: userId }, null, {
      collation: { locale: "en", strength: 1 },
    });
    if (!client) {
      client = await clientModel.findOne({ email: userId });
      if (!client) {
        return res.status(401).json({
          error: true,
          data: {
            errorMessage: "Authentication failed. Invalid credentials",
          },
        });
      }
    }

    const passwordMatch = await bcrypt.compare(password, client.password);
    if (!passwordMatch) {
      return res.status(401).json({
        error: true,
        data: {
          errorMessage: "Authentication failed. Invalid credentials",
        },
      });
    }

    const token = jwt.sign(
      {
        clientId: client._id,
        clientName: client.clientName,
        clientEmail: client.email,
        consumerId: client.associatedConsumerId,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "24h",
      }
    );

    await clientModel.updateOne(
      { _id: client._id },
      { $set: { lastLogin: new Date() } }
    );

    return token;
  } catch (error) {
    console.error(
      "Error while handling client token generation request :: clientTokenGenerationHandler()"
    );
    throw error;
  }
};

export const updateWebhookHanlder = async (payload, token) => {
  try {
    const tokenInfo = extractTokenInfo(token);

    if (!tokenInfo.clientId) {
      throw new CustomError(
        "Invalid client token used for raising data monitoring request",
        401
      );
    }

    const clientId = tokenInfo.clientId;
    const consumerId = tokenInfo.consumerId;

    const clientData = await clientModel.findOne({
      _id: new Types.ObjectId(clientId),
    });

    if (!clientData) {
      throw new CustomError(
        "No client found for the given update request",
        409
      );
    }

    const clientWebhookData = await clientWebhookModel.findOne({
      clientId: new Types.ObjectId(clientId),
    });

    if (!clientWebhookData) {
      await clientWebhookModel.create({
        clientId: clientId,
        associatedConsumerId: consumerId,
        enrichmentWebhook: payload.webhook,
        enrichmentWebhookToken: payload.webhookToken,
      });
    } else {
      throw new CustomError(
        `Webhook is already updted for the given clientID ${clientId}`
      );
    }
    // Return updated document
    return await clientModel.findOne({
      _id: new Types.ObjectId(clientId),
    });
  } catch (error) {
    console.error(
      "Error while handling update subscription request :: updateWebhookHanlder()",
      error
    );
    throw error;
  }
};
