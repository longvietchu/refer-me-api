import { Document, model, Schema } from 'mongoose';

export enum Role {
    USER = 'USER',
    ADMIN = 'ADMIN'
}

export interface IUser extends Document {
    id: string;
    name: string;
    email: string;
    password: string;
    avatar: string;
    headline: string;
    role: Role;
}

const UserSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        avatar: String,
        headline: String,
        role: {
            type: Role,
            default: Role.USER
        }
    },
    { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export const User = model('users', UserSchema);
