import { model, Schema, Types } from 'mongoose';

const PostImageSchema: Schema = new Schema(
    {
        link: {
            type: String,
            required: true
        },
        post_id: {
            type: Types.ObjectId,
            ref: 'posts'
        }
    },
    { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export const PostImage = model('post_images', PostImageSchema);
