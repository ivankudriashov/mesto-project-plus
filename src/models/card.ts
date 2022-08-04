import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';

interface ICard {
  name: string,
  link: string,
  owner: mongoose.Schema.Types.ObjectId,
  likes: ObjectId[],
  createdAt: Date
}

const cardSchema = new mongoose.Schema<ICard>({
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
    default: [],
  },
  likes: {
    type: [ObjectId],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export default mongoose.model<ICard>('card', cardSchema);
