import { Request, Response, NextFunction } from 'express';
import User from '../models/user';
import { NotFoundError, ProfileError } from '../errors/errors';
import { SessionRequest } from '../utils/interfaces';

export const findById = (req: SessionRequest, res: Response, next: NextFunction) => {
  const _id = req.params.userId;

  return User.findById(_id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Такого пользователя не существует.');
      }
      res.send({ user });
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
    res.status(201).send({ user });
  }).catch((err) => {
    switch (err.name) {
      case 'ValidationError':
        next(new ProfileError('Переданы некорректные данные при создании пользователя.'));
        break;
      default: next(err);
    }
  });
};
