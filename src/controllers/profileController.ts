import { Request, Response } from 'express';

import { Profile } from '../models/Profile';

class ProfileController {
    public create = async (req: Request, res: Response) => {
        try {
            const { dob, avatar, backgroundImage, about, gender } = req.body;

            let newProfile = {};
            if (gender) {
                newProfile = {
                    dob,
                    avatar,
                    backgroundImage,
                    about,
                    gender,
                    userId: req.user.id
                };
            } else {
                newProfile = {
                    dob,
                    avatar,
                    backgroundImage,
                    about,
                    userId: req.user.id
                };
            }
            const existProfile = await Profile.findOne({
                userId: req.user.id
            });
            if (existProfile) {
                // Update
                const profileUpdate = await Profile.findOneAndUpdate(
                    { userId: req.user.id },
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
        } catch (error) {
            console.log(error);
        }
    };
}

export const profileController = new ProfileController();
