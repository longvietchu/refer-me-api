import { model, Schema, Types } from 'mongoose';

const ApplicantSchema: Schema = new Schema(
    {
        user_id: {
            type: Types.ObjectId,
            ref: 'users'
        },
        job_id: {
            type: Types.ObjectId,
            ref: 'jobs'
        }
    },
    { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export const Applicant = model('applicants', ApplicantSchema);
