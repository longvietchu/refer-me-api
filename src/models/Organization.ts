import { model, Schema, Types } from 'mongoose';

const OrganizationSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        avatar: String,
        background_image: String,
        description: String,
        website: String,
        industry: String,
        company_size: Number,
        founded: Date,
        user_id: {
            type: Types.ObjectId,
            ref: 'users'
        }
    },
    { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export const Organization = model('organizations', OrganizationSchema);
