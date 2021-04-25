import { model, Schema, Types } from 'mongoose';

const ReactionSchema: Schema = new Schema(
    {
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

export const Reaction = model('reactions', ReactionSchema);
