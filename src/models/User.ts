import mongoose, { Schema } from 'mongoose';

export enum Role {
    USER = 'USER',
    ADMIN = 'ADMIN'
}

const UserSchema: Schema = new mongoose.Schema(
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

export default mongoose.model('users', UserSchema);
