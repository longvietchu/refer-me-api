import { model, Schema, Types } from 'mongoose';

const JobSchema: Schema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        location: String,
        description: String,
        seniority_level: String,
        employment_type: String,
        industry: String,
        job_functions: String,
        user_id: {
            type: Types.ObjectId,
            ref: 'users'
        },
        organization_id: {
            type: Types.ObjectId,
            ref: 'organizations'
        }
    },
    { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export const Job = model('jobs', JobSchema);
