import { Request, Response } from 'express';
import { Profile } from '../models/Profile';
import handleError from '../utils/handleError';
import mongoose from 'mongoose';

class ProfileController {
    public create = async (req: Request, res: Response) => {
        const { dob, about, gender, background_image } = req.body;
        const newProfile = {
            dob,
            about,
            gender,
            background_image,
            user_id: req.user.id
        };

        try {
            const existProfile = await Profile.findOne({
                user_id: req.user.id
            });
            if (existProfile) {
                // Update
                const profileUpdate = await Profile.findOneAndUpdate(
                    { user_id: req.user.id },
                    { $set: newProfile },
                    {
                        setDefaultsOnInsert: true,
                        new: true,
                        upsert: true,
                        useFindAndModify: false,
                        omitUndefined: true
                    }
                );
                return res.status(200).json(profileUpdate);
            }
            const savedProfile = await new Profile(newProfile).save();
            return res.status(200).json({ data: savedProfile, success: true });
        } catch (e) {
            return handleError(res, e, 'Cannot create new profile.');
        }
    };

    public getOne = async (req: Request, res: Response) => {
        const { user_id } = req.params;
        try {
            const profile = await Profile.aggregate([
                {
                    $lookup: {
                        from: 'users',
                        localField: 'user_id',
                        foreignField: '_id',
                        as: 'user_info'
                    }
                },
                {
                    $unwind: {
                        path: '$user_info',
                        preserveNullAndEmptyArrays: true
                    }
                }
            ])
                .match({
                    user_id: mongoose.Types.ObjectId(user_id)
                })
                .project({
                    'user_info.role': 0,
                    'user_info.password': 0,
                    'user_info.created_at': 0,
                    'user_info.updated_at': 0
                })
                .limit(1)
                .exec();
            if (profile) {
                return res.status(200).json({
                    data: profile[0],
                    success: true
                });
            }
            return res.status(400).json({ msg: 'User does not have profile' });
        } catch (e) {
            return handleError(res, e, 'Cannot get profile.');
        }
    };

    public delete = async (req: Request, res: Response) => {
        try {
            const profile = await Profile.findOne({ user_id: req.user.id });
            if (profile) {
                const result = await Profile.deleteOne({
                    user_id: req.user.id
                });
                return res.status(200).json({
                    data: result,
                    success: true
                });
            }
            return res.status(401).json({
                msg: 'Unauthorized to delete profile.',
                success: false
            });
        } catch (e) {
            return handleError(res, e, 'Cannot delete profile,');
        }
    };
}

export const profileController = new ProfileController();
