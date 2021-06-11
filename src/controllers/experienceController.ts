import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { Experience } from '../models/Experience';
import handleError from '../utils/handleError';
import mongoose from 'mongoose';

class ExperienceController {
    public getAllByUserId = async (req: Request, res: Response) => {
        const user_id = req.query.user_id as string;
        try {
            const experiences = await Experience.aggregate([
                {
                    $lookup: {
                        from: 'organizations',
                        localField: 'organization_id',
                        foreignField: '_id',
                        as: 'organization_info'
                    }
                },
                {
                    $unwind: {
                        path: '$organization_info',
                        preserveNullAndEmptyArrays: true
                    }
                }
            ])
                .match({
                    user_id: mongoose.Types.ObjectId(user_id)
                })
                .project({
                    'organization_info.user_id': 0
                })
                .sort({ created_at: 'desc' })
                .exec();
            return res.status(200).json({ data: experiences, success: true });
        } catch (e) {
            return handleError(res, e, 'Cannot get experiences by user id.');
        }
    };

    public getOneById = async (req: Request, res: Response) => {
        const experience_id = req.query.experience_id as string;
        try {
            const experience = await Experience.findById(experience_id);
            return res.status(200).json({ data: experience, success: true });
        } catch (e) {
            return handleError(res, e, 'Cannot get experience by id.');
        }
    };

    public create = async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const {
            job_title,
            job_description,
            company,
            location,
            employment_type,
            headline,
            joined_at,
            left_at,
            organization_id
        } = req.body;
        const newExperience = {
            job_title,
            job_description,
            company,
            location,
            employment_type,
            headline,
            joined_at,
            left_at,
            user_id: req.user.id,
            organization_id
        };
        try {
            const result = await Experience.create(newExperience);
            return res.status(200).json({ data: result, success: true });
        } catch (e) {
            return handleError(res, e, 'Cannot create experience.');
        }
    };

    public update = async (req: Request, res: Response) => {
        const { experience_id } = req.params;
        const {
            job_title,
            job_description,
            company,
            location,
            employment_type,
            joined_at,
            left_at,
            organization_id
        } = req.body;
        const updateExperience = {
            job_title,
            job_description,
            company,
            location,
            employment_type,
            joined_at,
            left_at,
            organization_id
        };

        try {
            const experience: any = await Experience.findById(experience_id);
            console.log(updateExperience);
            if (experience) {
                if (experience.user_id.equals(req.user.id)) {
                    const result = await Experience.findOneAndUpdate(
                        { _id: experience_id },
                        { $set: updateExperience },
                        {
                            setDefaultsOnInsert: true,
                            new: true,
                            upsert: true,
                            useFindAndModify: false,
                            omitUndefined: true
                        }
                    );
                    return res
                        .status(200)
                        .json({ data: result, success: true });
                }
                return res.status(401).json({
                    message: 'Unauthorized to update experience',
                    success: false
                });
            }
            return res.status(404).json({
                message: 'Experience not found.',
                success: false
            });
        } catch (e) {
            return handleError(res, e, 'Cannot update experience.');
        }
    };

    public delete = async (req: Request, res: Response) => {
        const { experience_id } = req.params;
        try {
            const experience: any = await Experience.findById(experience_id);
            if (experience) {
                if (experience.user_id.equals(req.user.id)) {
                    const result = await Experience.findByIdAndDelete(
                        experience_id
                    );
                    return res
                        .status(200)
                        .json({ data: result, success: true });
                }
                return res.status(401).json({
                    message: 'Unauthorized to delete experience.',
                    success: false
                });
            }
        } catch (e) {
            return handleError(res, e, 'Cannot delete experience.');
        }
    };
}

export const experienceController = new ExperienceController();
