import { model, Schema, Types } from 'mongoose';

const PostSchema: Schema = new Schema(
    {
        description: String,
        post_image: [String],
        reactions: [
            {
                type: Types.ObjectId,
                ref: 'reactions'
            }
        ],
        user_id: {
            type: Types.ObjectId,
            ref: 'users'
        }
    },
    { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export const Post = model('posts', PostSchema);
