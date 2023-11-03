import * as Joi from 'joi';

// set preference
export interface SetPreferenceDto {
  accountId: string;
  endpoint: string;
  dapp: string;
  block: boolean;
}
export const SetPreferenceSchema = Joi.object({
  accountId: Joi.string().min(2).max(64).required(),
  endpoint: Joi.string().uri().required(),
  dapp: Joi.string().required(),
  block: Joi.boolean().required(),
});
