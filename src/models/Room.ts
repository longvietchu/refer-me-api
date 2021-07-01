import { model, Schema, Types } from 'mongoose';
import { MessageSchema } from './Message';

const RoomSchema: Schema = new Schema(
    {
        _id: {
            type: String,
            required: true
        }, // [pk, note: "creator_id.receiver_id"]
        creator_id: {
            type: Types.ObjectId,
            ref: 'users'
        },
        receiver_id: {
            type: Types.ObjectId,
            ref: 'users'
        },
        user_info: {
            _id: String,
            email: String,
            name: String,
            avatar: String,
            headline: String
        },
        lastest_message: MessageSchema
    },
    { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export const Room = model('rooms', RoomSchema);
