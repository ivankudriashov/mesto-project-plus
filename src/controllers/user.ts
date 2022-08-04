import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import User from '../models/user';
import { ProfileError } from '../errors/errors';

export const findById = (req: Request, res: Response, next: NextFunction) => {
  const _id = req.params.id;
  const isValidId = mongoose.Types.ObjectId.isValid(_id);

  if (!isValidId) return res.status(404).send({ message: 'Пользователь по указанному _id не найден.' });

  return User.findById(_id)
    .then((user) => {
      res.send({ user });
    })
    .catch(next);
};

export const findAll = (req: Request, res: Response, next: NextFunction) => {
  User.find({})
    .then((users) => res.send({ users }))
    .catch(next);
};

export const create = (req: Request, res: Response, next: NextFunction) => {
  User.create({
    name: req.body.name,
    about: req.body.about,
    avatar: req.body.avatar,
  }).then((user) => {
    if (!user) {
      throw new ProfileError('Переданы некорректные данные при создании пользователя.');
    } else {
      res.status(201).send({
        _id: user._id,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
      });
    }
  }).catch(next);
};
