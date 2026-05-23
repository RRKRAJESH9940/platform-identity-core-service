import { Schema, model } from "mongoose";
import { getPlatformIdentityDBConn } from "../helpers/connections/mongo.connection.js";

const clientSchema = new Schema(
  {
    clientId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    associatedConsumerId: {
      type: Schema.Types.ObjectId,
      default:null,
    },
    enrichmentWebhook: {
      type: String,
      required: true,
    },
    enrichmentWebhookToken: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const dbConn = getPlatformIdentityDBConn();

const clientWebhookModel = dbConn.model("clientWebook", clientSchema);

export default clientWebhookModel;
