import { Joi } from 'celebrate';
import { id } from './patterns';

export const idValidationMethod = (value: string, helpers: any) => {
  if (!id.test(value)) {
    return helpers.error('any.invalid');
  }
  return value;
};

export const idValidation = Joi.string().custom(idValidationMethod, 'id validation');
