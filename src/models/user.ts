import mongoose, { Document, Model } from 'mongoose';
import { ProfileError } from '../errors/errors';

interface IUserSchema extends Document {
  name: string,
  about: string,
  avatar: string,
}

interface IUserModel extends Model<IUserSchema> {
  // eslint-disable-next-line no-unused-vars
  findAndChangedUser(_id: string | undefined, obj: any): Promise<IUserSchema>
}

const userSchema = new mongoose.Schema<IUserSchema>({
  name: {
    type: String,
    required: [
      true,
      'username is required',
    ],
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: [
      true,
      'about is required',
    ],
    minlength: 2,
    maxlength: 200,
  },
  avatar: {
    type: String,
    required: [
      true,
      'avatar is required',
    ],
  },
});

userSchema.statics.findAndChangedUser = function (_id, obj) {
  return this.findByIdAndUpdate(
    _id,
    obj,
    { new: true, runValidators: true },
  ).then((user: IUserSchema & {
    _id: mongoose.Types.ObjectId;
  } | null) => {
    if (!user) {
      throw new ProfileError('Переданы некорректные данные при обновлении профиля.');
    } else {
      return user;
    }
  });
};

export default mongoose.model<IUserSchema, IUserModel>('user', userSchema);
