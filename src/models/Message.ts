import { model, Schema, Types } from 'mongoose';

const MessageSchema: Schema = new Schema(
    {
        room_id: {
            type: String,
            required: true
        }, // [not null, note: "creator_id.receiver_id"]
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
            required: true
        },
        type: String // Enum: TEXT | IMAGE | EMOJI
    },
    { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export const Message = model('messages', MessageSchema);
