import { Schema, model, Document, Types } from 'mongoose';

interface IComment extends Document {
  productId: Types.ObjectId;
  username: string;
  message: string;
  replies: Types.ObjectId[];
}

const commentSchema = new Schema<IComment>({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  username: { type: String, required: true },
  message: { type: String, required: true },
  replies: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
});

const Comment = model<IComment>('Comment', commentSchema);

export default Comment;
