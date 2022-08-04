import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Card from '../models/card';
import { SessionRequest } from '../utils/interfaces';

export const deleteCard = (req: Request, res: Response, next: NextFunction) => {
  const _id = req.params.id;
  const isValidId = mongoose.Types.ObjectId.isValid(_id);

  if (!isValidId) return res.status(404).send({ message: 'Карточка с указанным _id не найдена.' });

  return Card.deleteOne({ _id })
    .then(() => { res.status(200).send({}); })
    .catch(next);
};

export const findAll = (req: Request, res: Response, next: NextFunction) => {
  Card.find({})
    .then((cards) => res.send({ cards }))
    .catch(next);
};

export const create = (req: SessionRequest, res: Response) => {
  let _id;

  if (req.user) {
    _id = req.user._id;
  }

  Card.create({
    name: req.body.name,
    link: req.body.link,
    owner: _id,
  }).then(() => {
    res.status(201).send({
    });
  }).catch(() => {
    res.status(400).send({ message: 'Переданы некорректные данные при создании карточки.' });
  });
};

export const likeCard = (req: SessionRequest, res: Response, next: NextFunction) => {
  let _id;

  if (req.user) {
    _id = req.user._id;
  }

  const _cardId = req.params.cardId;
  const isValidId = mongoose.Types.ObjectId.isValid(_cardId);

  if (!isValidId) return res.status(404).send({ message: 'Карточка с указанным _id не найдена.' });

  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: _id } },
    { new: true },
  ).then(() => {
    res.status(200).send({});
  }).catch(next);
};

export const dislikeCard = (req: SessionRequest, res: Response, next: NextFunction) => {
  let _id;

  if (req.user) {
    _id = req.user._id;
  }

  const _cardId = req.params.cardId;
  const isValidId = mongoose.Types.ObjectId.isValid(_cardId);

  if (!isValidId) return res.status(404).send({ message: 'Карточка с указанным _id не найдена.' });

  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: _id } },
    { new: true },
  ).then(() => {
    res.status(200).send({});
  }).catch(next);
};
