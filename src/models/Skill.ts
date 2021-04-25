import { model, Schema, Types } from 'mongoose';

const SkillSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        votes: Number,
        user_id: {
            type: Types.ObjectId,
            ref: 'users'
        }
    },
    { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export const Skill = model('skills', SkillSchema);
