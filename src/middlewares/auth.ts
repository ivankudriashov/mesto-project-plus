import { NextFunction, Response } from 'express';
import { SessionRequest } from '../utils/interfaces';

export default (req: SessionRequest, res: Response, next: NextFunction) => {
  req.user = {
    _id: '62ed48bde0cd6eb3d8c85589',
  };

  next();
};
