import mongoose, { Schema } from 'mongoose';

const ProfileSchema: Schema = new mongoose.Schema({
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
        type: Number
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    }
})

export default mongoose.model('profiles', ProfileSchema);