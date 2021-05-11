import { model, Schema, Types } from 'mongoose';

const ApplicantSchema: Schema = new Schema(
    {
        greeting: String,
        user_id: {
            type: Schema.Types.ObjectId,
            ref: 'users'
        },
        job_id: {
            type: Schema.Types.ObjectId,
            ref: 'jobs'
        }
    },
    { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export const Applicant = model('applicants', ApplicantSchema);
