import { Response, NextFunction } from 'express';
import { SessionRequest } from '../utils/interfaces';
import User from '../models/user';
import { NotFoundError } from '../errors/errors';

export const changeProfile = (req: SessionRequest, res: Response, next: NextFunction) => {
  const _id = req.user?._id;

  return User.findAndChangedUser(
    _id,
    {
      $set: {
        name: req.body.name,
        about: req.body.about,
      },
    },
  )
    .then((user) => {
      res.status(200).send({
        name: user.name,
        about: user.about,
      });
    })
    .catch((err) => {
      switch (err.name) {
        case 'CastError':
          next(new NotFoundError('Такого пользователя не существует.'));
          break;
        default: next(err);
      }
    });
};

export const changeAvatar = (req: SessionRequest, res: Response, next: NextFunction) => {
  const _id = req.user?._id;

  return User.findAndChangedUser(
    _id,
    {
      $set: {
        avatar: req.body.avatar,
      },
    },
  ).then((user) => {
    res.status(200).send({
      avatar: user.avatar,
    });
  }).catch((err) => {
    switch (err.name) {
      case 'CastError':
        next(new NotFoundError('Такого пользователя не существует.'));
        break;
      default: next(err);
    }
  });
};
