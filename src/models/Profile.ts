import { Document, model, Model, ObjectId, Schema } from 'mongoose';

export interface IProfile extends Document {
    dob: Date;
    avatar: string;
    backgroundImage: string;
    about: string;
    gender: number;
    userId: ObjectId;
}

const ProfileSchema: Schema = new Schema({
    dob: {
        type: Date
    },
    avatar: {
        type: String
    },
    backgroundImage: {
        type: String
    },
    about: {
        type: String
    },
    gender: {
        type: Number,
        default: 0
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    }
})

export const Profile: Model<IProfile> =  model('profiles', ProfileSchema);