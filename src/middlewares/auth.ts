import { NextFunction, Response } from 'express';
import { SessionRequest } from '../utils/interfaces';

export default (req: SessionRequest, res: Response, next: NextFunction) => {
  req.user = {
    _id: '62e7f322bcfe171cd59caa7a',
  };

  next();
};
