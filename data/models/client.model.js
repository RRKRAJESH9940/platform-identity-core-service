import { Schema, model } from "mongoose";
import { getPlatformOrcDBConnection } from "../helpers/connections/mongo.connection.js";
const clientSchema = new Schema(
  {
    clientName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    webhook: {
      type: String,
      required: true,
    },
    webhookToken: {
      type: String,
      required: true,
    }, // TODO: on onboarding - perform auto test for webhook
    alertWebhook: {
      type: String,
      required: true,
    },
    alertWebhookToken: {
      type: String,
      required: true,
    },
    associatedConsumerId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    subscribedModules: {
      type: [String],
      default: [],
    },
    subscriptionWebhook: {
      type: String,
      default: null,
    },
    subscriptionWebhookToken: {
      type: String,
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    lastLogin: {
      type: Date,
      default: new Date(),
    },
  },
  { timestamps: true }
);

const dbConn = getPlatformOrcDBConnection();

const clientModel = dbConn.model("client", clientSchema);

export default clientModel;
