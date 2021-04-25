import { Request, Response } from 'express';
import errorHandler from '../utils/errorHandler';
import { Profile } from '../models/Profile';

class ProfileController {
    public create = async (req: Request, res: Response) => {
        const { dob, avatar, background_image, about, gender } = req.body;
        try {
            let newProfile = {};
            if (gender) {
                newProfile = {
                    dob,
                    avatar,
                    background_image,
                    about,
                    gender,
                    user_id: req.user.id
                };
            } else {
                newProfile = {
                    dob,
                    avatar,
                    background_image,
                    about,
                    user_id: req.user.id
                };
            }
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
                        useFindAndModify: false
                    }
                );
                return res.status(200).json(profileUpdate);
            }

            // Create
            const savedProfile = await new Profile(newProfile).save();
            return res.status(200).json(savedProfile);
        } catch (e) {
            console.log(e);
            return errorHandler(res, e, 'Cannot create new profile.');
        }
    };

    public getProfile = async (req: Request, res: Response) => {
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
            console.log(e);
            return errorHandler(res, e, 'Cannot get profile.');
        }
    };
}

export const profileController = new ProfileController();
