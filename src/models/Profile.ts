import { model, Schema, Types } from 'mongoose';

const ProfileSchema: Schema = new Schema(
    {
        dob: Date,
        background_image: String,
        about: String,
        gender: {
            type: Number,
            default: 0
        },
        user_id: {
            type: Types.ObjectId,
            ref: 'users'
        }
    },
    { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export const Profile = model('profiles', ProfileSchema);
