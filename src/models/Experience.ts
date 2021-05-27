import { model, Schema, Types } from 'mongoose';

const ExperienceSchema: Schema = new Schema(
    {
        job_title: String,
        job_description: String,
        company: String,
        location: String,
        employment_type: String,
        headline: String,
        joined_at: Date,
        left_at: Date,
        user_id: {
            type: Types.ObjectId,
            ref: 'users',
            required: true
        },
        organization_id: {
            type: Types.ObjectId,
            ref: 'organizations'
        }
    },
    { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export const Experience = model('experiences', ExperienceSchema);
