import { Request, Response } from 'express';
import { Profile } from '../models/Profile';
import handleError from '../utils/handleError';

class ProfileController {
    public create = async (req: Request, res: Response) => {
        const { dob, avatar, background_image, about, gender } = req.body;
        const newProfile = {
            dob,
            avatar,
            background_image,
            about,
            gender,
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

            // Create
            const savedProfile = await new Profile(newProfile).save();
            return res.status(200).json(savedProfile);
        } catch (e) {
            return handleError(res, e, 'Cannot create new profile.');
        }
    };

    public getOne = async (req: Request, res: Response) => {
        const { user_id } = req.params;
        try {
            const profile = await Profile.findOne({ user_id });
            if (profile) {
                const {
                    dob,
                    avatar,
                    background_image,
                    about,
                    gender
                }: any = profile;
                return res.status(200).json({
                    profile: { dob, avatar, background_image, about, gender }
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
