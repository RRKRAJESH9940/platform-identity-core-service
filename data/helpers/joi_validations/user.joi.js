import Joi from "joi";

export const getClientWebhookInfoSchema = Joi.object({
  clientId: Joi.string().required(),
}).required();

export const validateClientTokenSchema = Joi.object({
  token: Joi.string().required(),
}).required();
