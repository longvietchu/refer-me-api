import { model, Schema, Types } from 'mongoose';

const ConnectionSchema: Schema = new Schema(
    {
        _id: String, // "sender_id.receiver_id"
        sender_id: {
            type: Types.ObjectId,
            ref: 'users'
        },
        receiver_id: {
            type: Types.ObjectId,
            ref: 'users'
        }
    },
    { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export const Connection = model('connections', ConnectionSchema);
