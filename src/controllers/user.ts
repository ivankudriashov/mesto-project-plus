import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import NotFoundError from '../errors/notFoundError';
import RequestError from '../errors/requestError';
import ConflictError from '../errors/conflictError';
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
          next(new RequestError('Переданы некорректные данные при обновлении профиля.'));
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

export const findUser = (req: SessionRequest, res: Response, next: NextFunction) => {
  const _id = req.user?._id;

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
          next(new RequestError('Переданы некорректные данные при обновлении профиля.'));
          break;
        default: next(err);
      }
    });
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;

  User.find({ email })
    .then((user) => {
      if (user.length > 0) {
        throw new ConflictError(`Пользователь с адресом электронной почты ${email} уже существует`);
      }

      bcrypt.hash(req.body.password, 10)
        .then((hash) => User.create({
          email: req.body.email,
          password: hash,
          name: req.body.name,
          about: req.body.about,
          avatar: req.body.avatar,
        // eslint-disable-next-line no-shadow
        })).then((user) => {
          if (!user) {
            throw new RequestError('Переданы некорректные данные при создании пользователя.');
          } else {
            res.status(201).send({ user });
          }
        }).catch((err) => {
          switch (err.name) {
            case 'ValidationError':
              next(new RequestError('Переданы некорректные данные при создании пользователя.'));
              break;
            default: next(err);
          }
        });
    })
    .catch(next);
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  const { NODE_ENV, JWT_SECRET } = process.env;

  return User.findUserByCredentials(email, password)
    .then((user: any) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET as string : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch(next);
};

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
          next(new RequestError('Переданы некорректные данные при обновлении профиля.'));
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
        next(new RequestError('Переданы некорректные данные при обновлении профиля.'));
        break;
      default: next(err);
    }
  });
};
