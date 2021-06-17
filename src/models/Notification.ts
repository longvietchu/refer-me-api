import { model, Schema, Types } from 'mongoose';

const NotificationSchema: Schema = new Schema(
    {
        content: String,
        url: String,
        creator_id: {
            type: Schema.Types.ObjectId,
            ref: 'users'
        },
        recipient_id: {
            type: Schema.Types.ObjectId,
            ref: 'users'
        }
    },
    { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export const Notification = model('notifications', NotificationSchema);
