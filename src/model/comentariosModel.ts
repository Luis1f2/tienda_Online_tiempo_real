import { Schema, model, Document, Types } from 'mongoose';

interface IComment extends Document {
  username: string;
  message: string;
  replies: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>({
  username: { type: String, required: true },
  message: { type: String, required: true },
  replies: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
}, {
  timestamps: true //habilita crear tiempo en los comentarios
});

const Comment = model<IComment>('Comment', commentSchema);

export default Comment;
