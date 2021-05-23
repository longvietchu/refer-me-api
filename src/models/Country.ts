import { model, Schema, Types } from 'mongoose';

const CountrySchema: Schema = new Schema(
    {
        province: String,
        city: String,
        country: String,
        headquarter: Boolean,
        organization_id: {
            type: Types.ObjectId,
            ref: 'organizations'
        }
    },
    { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export const Country = model('countries', CountrySchema);
