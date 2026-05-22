import { Schema, model } from "mongoose";
import { userRoles } from "../helpers/enums/enums.config.js";
import { getPlatformOrcDBConnection } from "../helpers/connections/mongo.connection.js";
const userSchema = new Schema(
  {
    userName: {
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
    role: {
      type: String,
      enum: userRoles,
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

const userModel = dbConn.model("user", userSchema);

export default userModel;
