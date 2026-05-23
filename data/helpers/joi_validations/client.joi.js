import Joi from "joi";
import { platformServices } from "../enums/enums.config.js";

export const clientTokenRequestSchema = Joi.object({
  userId: Joi.string().required().messages({
    "string.base": "userId must be a valid string.",
    "string.empty": "userId cannot be empty.",
    "any.required": "Invalid request payload. Mandatory fields are missing.", //If field name is n't present, mask the field name in error message
  }),
  password: Joi.string().required().messages({
    "string.base": "password must be a valid string.",
    "string.empty": "password cannot be empty.",
    "any.required": "Invalid request payload. Mandatory fields are missing.", //If field name is n't present, mask the field name in error message
  }),
}).required();

export const clientWebhookUpdateSchema = Joi.object({
  platformService: Joi.string()
    .valid(...platformServices)
    .required(),
  webhook: Joi.string().uri().required(),
  webhookToken: Joi.string().required(),
}).required();
