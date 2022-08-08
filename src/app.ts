/* eslint-disable no-unused-vars */
import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { celebrate, Joi } from 'celebrate';
import routerUser from './routes/user';
import routerCard from './routes/card';
import auth from './middlewares/auth';
import { login, createUser } from './controllers/user';
import { requestLogger, errorLogger } from './middlewares/logger';
import { errorHandling } from './middlewares/validation';

require('dotenv').config();

interface SessionError extends Error {
  statusCode: number,
  message: string
}

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(requestLogger);

app.post('/signin', login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().alphanum().min(2).max(30),
    about: Joi.string().alphanum().min(2).max(200),
    // eslint-disable-next-line no-shadow, no-useless-escape
    avatar: Joi.string().pattern(/https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9-\._~:\/?#\[\]@!\$&'\(\)\*\+,;=]{1,}\.[a-zA-Z]{2,}#{0,1}/),
  }),
}), createUser);

app.use(auth);

app.use('/users', routerUser);
app.use('/cards', routerCard);

app.get('*', (req, res) => {
  res.status(404).send({ message: 'Страница не найдена' });
});

app.use(errorLogger);

app.use((req, res, next) => {
  res.status(404).json({
    message: 'Страница не найдена',
  });
});

app.use(errorHandling);

app.use((err: SessionError, req: Request, res: Response, next: NextFunction) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
});

app.listen(+PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
