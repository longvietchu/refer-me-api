import { Document, model, Model, Schema } from 'mongoose';

export enum Role {
    USER = 'USER',
    ADMIN = 'ADMIN'
}

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: Role
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
        role: {
            type: Role,
            default: Role.USER
        }
    },
    {
        timestamps: true
    }
);

export const User: Model<IUser> = model('users', UserSchema);
