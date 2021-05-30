import { model, Schema, Types } from 'mongoose';

const CommentSchema: Schema = new Schema(
    {
        content: {
            type: String,
            required: true
        },
        post_id: {
            type: Types.ObjectId,
            ref: 'posts'
        },
        user_id: {
            type: Types.ObjectId,
            ref: 'users'
        }
    },
    { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export const Comment = model('comments', CommentSchema);
