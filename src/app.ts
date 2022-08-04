import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import path from 'path';
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

app.use((err: SessionError, req: Request, res: Response) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
});

app.use(express.static(path.join(__dirname, 'dist')));

app.listen(+PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
