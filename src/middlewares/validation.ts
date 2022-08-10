import { CelebrateError, isCelebrateError } from 'celebrate';
import { Request, Response, NextFunction } from 'express';
import RequestError from '../errors/requestError';

// eslint-disable-next-line import/prefer-default-export
export const errorHandling = (
  err: CelebrateError,
  req: Request,
  res: Response,
  next: NextFunction,
// eslint-disable-next-line consistent-return
) => {
  if (!isCelebrateError(err)) {
    return next(err);
  }
  const errorBody = err.details.get('body');
  const messageBody = errorBody?.details[0].message;
  const errorParams = err.details.get('params');
  const messageParams = errorParams?.details[0].message;

  if (messageBody) {
    throw new RequestError(messageBody);
  } else if (messageParams) {
    throw new RequestError(messageParams);
  } else {
    next(err);
  }
};
