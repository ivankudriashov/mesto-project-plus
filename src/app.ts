import express from 'express';
import mongoose from 'mongoose';
import { celebrate, Joi } from 'celebrate';
import routerUser from './routes/user';
import routerCard from './routes/card';
import auth from './middlewares/auth';
import { login, createUser } from './controllers/user';
import { requestLogger, errorLogger } from './middlewares/logger';
import { errorHandling } from './middlewares/validation';
import NotFoundError from './errors/notFoundError';
import errorsHandler from './middlewares/errorsHandler';
import { url } from './utils/patterns';

require('dotenv').config();

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
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(url),
  }),
}), createUser);

app.use(auth);

app.use('/users', routerUser);
app.use('/cards', routerCard);

app.use((req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

app.use(errorLogger);
app.use(errorHandling);

app.use(errorsHandler);

app.listen(+PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
