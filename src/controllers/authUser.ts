import mongoose from 'mongoose';
import { Response, NextFunction } from 'express';
import { SessionRequest } from '../utils/interfaces';
import User from '../models/user';
import { ProfileError } from '../errors/errors';

export const changeProfile = (req: SessionRequest, res: Response, next: NextFunction) => {
  let _id;
  let isValidId;

  if (req.user) {
    _id = req.user._id;
    isValidId = mongoose.Types.ObjectId.isValid(_id);
  } else {
    throw new Error();
  }

  if (!isValidId) return res.status(404).send({ message: 'Пользователь по указанному _id не найден.' });

  return User.findByIdAndUpdate(
    _id,
    {
      $set: {
        name: req.body.name,
        about: req.body.about,
      },
    },
    { new: true },
  ).then((user) => {
    if (user === null) {
      throw new ProfileError('Переданы некорректные данные при обновлении профиля.');
    } else {
      res.status(200).send({
        name: user.name,
        about: user.about,
      });
    }
  }).catch(next);
};

export const changeAvatar = (req: SessionRequest, res: Response, next: NextFunction) => {
  let _id;
  let isValidId;

  if (req.user) {
    _id = req.user._id;
    isValidId = mongoose.Types.ObjectId.isValid(_id);
  } else {
    throw new Error();
  }

  if (!isValidId) return res.status(404).send({ message: 'Пользователь по указанному _id не найден.' });

  return User.findByIdAndUpdate(
    _id,
    {
      $set: {
        avatar: req.body.avatar,
      },
    },
    { new: true },
  ).then((user) => {
    if (user === null) {
      throw new ProfileError('Переданы некорректные данные при обновлении профиля.');
    } else {
      res.status(200).send({
        avatar: user.avatar,
      });
    }
  }).catch(next);
};
