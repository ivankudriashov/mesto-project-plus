/* eslint-disable no-unused-vars */
import mongoose, { Document, Model } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import RequestError from '../errors/requestError';
import NotFoundError from '../errors/notFoundError';
import AuthError from '../errors/authError';
import { url } from '../utils/patterns';

interface IUserSchema extends Document {
  email: string,
  password: string,
  name: string,
  about: string,
  avatar: string,
}

interface IUserModel extends Model<IUserSchema> {
  findUserByCredentials(email: string, password: string): Promise<IUserSchema>,
  findAndChangedUser(_id: string | undefined, obj: any): Promise<IUserSchema>
}

const userSchema = new mongoose.Schema<IUserSchema, IUserModel>({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v: string) => validator.isEmail(v),
      message: 'Неправильный формат почты',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator(v: string) {
        // eslint-disable-next-line no-useless-escape
        return url.test(v);
      },
      message: 'Неправильный формат ссылки',
    },
  },
});

userSchema.statics.findUserByCredentials = function (email: string, password: string) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthError('Неправильные почта или пароль');
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new AuthError('Неправильные почта или пароль');
          }
          return user;
        });
    });
};

userSchema.statics.findAndChangedUser = function (_id: string | undefined, obj: any) {
  return this.findByIdAndUpdate(
    _id,
    obj,
    { new: true, runValidators: true },
  ).then((user: IUserSchema & {
    _id: mongoose.Types.ObjectId;
  } | null) => {
    if (!user) {
      throw new NotFoundError('Такого пользователя не существует.');
    } else {
      return user;
    }
  });
};

export default mongoose.model<IUserSchema, IUserModel>('user', userSchema);
