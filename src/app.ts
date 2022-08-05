import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import routerUser from './routes/user';
import routerAuthUser from './routes/authUser';
import routerCard from './routes/card';
import auth from './middlewares/auth';

interface SessionError extends Error {
  statusCode: number,
  message: string
}

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use('/users', routerUser);

app.use(auth);

app.use('/users', routerAuthUser);

app.use('/cards', routerCard);

// eslint-disable-next-line no-unused-vars
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
