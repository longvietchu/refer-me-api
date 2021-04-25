import { model, Schema, Types } from 'mongoose';

const RoomSchema: Schema = new Schema(
    {
        _id: String, // [pk, note: "creator_id.receiver_id"]
        creator_id: {
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

export const Room = model('rooms', RoomSchema);
