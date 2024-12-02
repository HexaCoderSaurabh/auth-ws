import * as Joi from '@hapi/joi';

export const ConfigValidationSchema = Joi.object({
  PORT: Joi.number().default(3002).required(),
  DB_TYPE: Joi.string().required(),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(3306).required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required()
});
