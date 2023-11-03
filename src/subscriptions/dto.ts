import * as Joi from 'joi';

// create subscription
export interface PushSubscriptionObjectDto {
  endpoint: string;
  expirationTime?: Number;
  keys: {
    p256dh: string;
    auth: string;
  };
}
export const PushSubscriptionObjectSchema = Joi.object({
  endpoint: Joi.string().uri().required(),
  expirationTime: Joi.number().allow(null),
  keys: Joi.object({
    p256dh: Joi.string().required(),
    auth: Joi.string().required(),
  }).required(),
});

export interface CreateSubscriptionDto {
  accountId: string;
  subscription: PushSubscriptionObjectDto;
  gateway: string;
}
export const CreateSubscriptionSchema = Joi.object({
  accountId: Joi.string().min(2).max(64).required(),
  subscription: PushSubscriptionObjectSchema,
  gateway: Joi.string().uri().required(),
});

// delete subscription
export interface DeleteSubscriptionDto {
  endpoint: string;
}
export const DeleteSubscriptionSchema = Joi.object({
  endpoint: Joi.string().uri().required(),
});
