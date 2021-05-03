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
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);
// OrganizationSchema.index({ name: 'text' });
OrganizationSchema.index(
    {
        name: 'text',
        description: 'text'
    },
    {
        weights: {
            name: 5,
            description: 1
        }
    }
);

export const Organization = model('organizations', OrganizationSchema);
