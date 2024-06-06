import { Schema, model, Document, Types } from 'mongoose';

interface IComment extends Document {
  productId: Types.ObjectId;
  username: string;
  message: string;
  createdAt: Date;
}

const CommentSchema = new Schema<IComment>({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  username: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default model<IComment>('Comment', CommentSchema);