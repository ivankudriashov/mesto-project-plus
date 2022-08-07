import mongoose, { ObjectId, Document, Model } from 'mongoose';
import { NotFoundError, ProfileError } from '../errors/errors';

interface ICardSchema extends Document {
  name: string,
  link: string,
  owner: mongoose.Schema.Types.ObjectId,
  likes: ObjectId[],
  createdAt: Date
}

interface ICardModel extends Model<ICardSchema> {
  // eslint-disable-next-line no-unused-vars
  findCardAndChangeLike(_id: string | undefined, obj: any): Promise<ICardSchema>
}

const cardSchema = new mongoose.Schema<ICardSchema>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 20,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'user',
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

cardSchema.statics.findCardAndChangeLike = function (_id, obj) {
  return this.findByIdAndUpdate(
    _id,
    obj,
    { new: true, runValidators: true },
  ).then((card: ICardSchema & {
    _id: mongoose.Types.ObjectId;
  } | null) => {
    console.log(card);
    if (!_id) {
      throw new ProfileError('Переданы некорректные данные.');
    }
    if (!card) {
      throw new NotFoundError('Карточка не найдена.');
    } else {
      return card;
    }
  });
};

export default mongoose.model<ICardSchema, ICardModel>('card', cardSchema);
