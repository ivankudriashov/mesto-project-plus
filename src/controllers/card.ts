import { Request, Response, NextFunction } from 'express';
import Card from '../models/card';
import User from '../models/user';
import { SessionRequest } from '../utils/interfaces';
import { NotFoundError, ProfileError } from '../errors/errors';

export const deleteCard = (req: Request, res: Response, next: NextFunction) => {
  const _id = req.params.cardId;

  return Card.deleteOne({ _id })
    .then((data) => {
      // deleteOne не возвращает null. сделал проверку по количеству удаленных элементов
      if (data.deletedCount === 0) {
        throw new NotFoundError('Такой карточки не существует.');
      }
      res.status(200).send({});
    })
    .catch((err) => {
      switch (err.name) {
        case 'CastError':
          next(new ProfileError('Переданы некорректные данные.'));
          break;
        default: next(err);
      }
    });
};

export const findAll = (req: Request, res: Response, next: NextFunction) => {
  Card.find({})
    .then((cards) => res.send({ cards }))
    .catch(next);
};

export const create = (req: SessionRequest, res: Response, next: NextFunction) => {
  const _id = req.user?._id;

  Card.create({
    name: req.body.name,
    link: req.body.link,
    owner: _id,
  }).then(() => {
    res.status(201).send({
    });
  }).catch((err) => {
    switch (err.name) {
      case 'ValidationError':
        next(new ProfileError('Переданы некорректные данные при создании пользователя.'));
        break;
      case 'CastError':
        next(new ProfileError('Переданы некорректные данные при создании пользователя.'));
        break;
      default: next(err);
    }
  });
};

export const likeCard = (req: SessionRequest, res: Response, next: NextFunction) => {
  const _id = req.user?._id;

  User.findById(_id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Такого пользователя не существует.');
      }
      Card.findCardAndChangeLike(
        req.params.cardId,
        { $addToSet: { likes: _id } },
      ).then(() => { // Проверка на null происходит в findCardAndChangeLike
        res.status(200).send({ message: 'Лайк добавлен' });
      }).catch((err) => {
        switch (err.name) {
          case 'CastError':
            next(new ProfileError('Переданы некорректные данные при добавлении лайка.'));
            break;
          default: next(err);
        }
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

export const dislikeCard = (req: SessionRequest, res: Response, next: NextFunction) => {
  const _id = req.user?._id;

  User.findById(_id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Такого пользователя не существует.');
      }
      Card.findCardAndChangeLike(
        req.params.cardId,
        { $pull: { likes: _id } },
      ).then(() => {
        res.status(200).send({ message: 'Лайк удален' });
      }).catch((err) => {
        switch (err.name) {
          case 'CastError':
            next(new ProfileError('Переданы некорректные данные при добавлении лайка.'));
            break;
          default: next(err);
        }
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
