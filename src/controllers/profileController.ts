import { Request, Response } from 'express';
import { Profile } from '../models/Profile';
import handleError from '../utils/handleError';

class ProfileController {
    public create = async (req: Request, res: Response) => {
        const { dob, about, gender, image } = req.body;
        const newProfile = {
            dob,
            about,
            gender,
            background_image: image,
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

    public updateBackgroundImage = async (req: Request, res: Response) => {
        const updateProfile = {
            background_image: req.body.image
        };

        try {
            const profile: any = await Profile.findOne({
                user_id: req.user.id
            });
            if (profile) {
                await Profile.updateOne(
                    { user_id: req.user.id },
                    { $set: updateProfile },
                    { omitUndefined: true }
                );
                return res
                    .status(200)
                    .json({ data: updateProfile, success: true });
            }
            return res.status(404).json({
                message: 'Profile not found.',
                success: false
            });
        } catch (e) {
            return handleError(res, e, 'Cannot update profile.');
        }
    };

    public getOne = async (req: Request, res: Response) => {
        const { user_id } = req.params;
        try {
            const profile = await Profile.findOne({ user_id })
                .select('dob background_image about gender')
                .exec();
            if (profile) {
                return res.status(200).json({
                    data: profile,
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
                await Profile.deleteOne({ user_id: req.user.id });
                return res.status(200).json({
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
