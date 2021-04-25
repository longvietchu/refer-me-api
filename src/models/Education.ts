import { model, Schema, Types } from 'mongoose';

const EducationSchema: Schema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: String,
        joined_at: Date,
        graduated_at: Date,
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

export const Education = model('educations', EducationSchema);
