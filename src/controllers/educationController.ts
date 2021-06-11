import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { Education } from '../models/Education';
import handleError from '../utils/handleError';
import mongoose from 'mongoose';

class EducationController {
    public getAllByUserId = async (req: Request, res: Response) => {
        const user_id = req.query.user_id as string;
        try {
            const educations = await Education.aggregate([
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
            return res.status(200).json({ data: educations, success: true });
        } catch (e) {
            return handleError(res, e, 'Cannot get educations by user id.');
        }
    };

    public getOneById = async (req: Request, res: Response) => {
        const education_id = req.query.education_id as string;
        try {
            const education = await Education.findById(education_id);
            return res.status(200).json({ data: education, success: true });
        } catch (e) {
            return handleError(res, e, 'Cannot get education by id.');
        }
    };

    public create = async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { title, description, joined_at, graduated_at, organization_id } =
            req.body;
        const newEducation = {
            title,
            description,
            joined_at,
            graduated_at,
            user_id: req.user.id,
            organization_id
        };
        try {
            const result = await Education.create(newEducation);
            return res.status(200).json({ data: result, success: true });
        } catch (e) {
            return handleError(res, e, 'Cannot create education.');
        }
    };

    public update = async (req: Request, res: Response) => {
        const { education_id } = req.params;
        const { title, description, joined_at, graduated_at, organization_id } =
            req.body;
        const updateEducation = {
            title,
            description,
            joined_at,
            graduated_at,
            organization_id
        };

        try {
            const education: any = await Education.findById(education_id);
            if (education) {
                if (education.user_id.equals(req.user.id)) {
                    const result = await Education.findOneAndUpdate(
                        { _id: education_id },
                        { $set: updateEducation },
                        { omitUndefined: true, new: true }
                    );
                    return res
                        .status(200)
                        .json({ data: result, success: true });
                }
                return res.status(401).json({
                    message: 'Unauthorized to update education',
                    success: false
                });
            }
            return res.status(404).json({
                message: 'Education not found.',
                success: false
            });
        } catch (e) {
            return handleError(res, e, 'Cannot update education.');
        }
    };

    public delete = async (req: Request, res: Response) => {
        const { education_id } = req.params;
        try {
            const education: any = await Education.findById(education_id);
            if (education) {
                if (education.user_id.equals(req.user.id)) {
                    const result = await Education.findByIdAndDelete(
                        education_id
                    );
                    return res
                        .status(200)
                        .json({ data: result, success: true });
                }
                return res.status(401).json({
                    message: 'Unauthorized to delete education.',
                    success: false
                });
            }
        } catch (e) {
            return handleError(res, e, 'Cannot delete education.');
        }
    };
}

export const educationController = new EducationController();
