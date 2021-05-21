import { model, Schema, Types } from 'mongoose';

export enum MessageType {
    TEXT = 'TEXT',
    IMAGE = 'IMAGE',
    EMOJI = 'EMOJI'
}

const MessageSchema: Schema = new Schema(
    {
        _id: {
            type: String,
            required: true
        },
        room_id: {
            type: String, // [not null, note: "creator_id.receiver_id"]
            required: true
        },
        from: {
            type: Types.ObjectId,
            ref: 'users'
        },
        to: {
            type: Types.ObjectId,
            ref: 'users'
        },
        content: {
            type: String,
            required: true
        },
        is_seen: {
            type: Boolean,
            required: true,
            default: false
        },
        type: {
            type: String, // Enum: TEXT | IMAGE | EMOJI
            default: MessageType.TEXT
        }
    },
    { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

const Message = model('messages', MessageSchema);

export { MessageSchema, Message };
