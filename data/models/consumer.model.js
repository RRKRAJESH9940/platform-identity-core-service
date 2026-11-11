import { Schema } from "mongoose";
import { getPlatformOrcDBConnection } from "../helpers/connections/mongo.connection.js";

const consumerSchema = new Schema(
  {
    consumerName: {
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

const consumerModel = dbConn.model("consumer", consumerSchema);
export default consumerModel;
