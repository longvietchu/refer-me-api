import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { Education } from '../models/Education';
import handleError from '../utils/handleError';

class EducationController {
    public getAllByUserId = async (req: Request, res: Response) => {
        const { user_id } = req.params;
        try {
            const educations = await Education.find({ user_id });
            return res.status(200).json({ data: educations, success: true });
        } catch (e) {
            return handleError(res, e, 'Cannot get educations by user id.');
        }
    };

    public getOneById = async (req: Request, res: Response) => {
        const { education_id } = req.params;
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
        const {
            title,
            description,
            joined_at,
            graduated_at,
            organization_id
        } = req.body;
        const newEducation = {
            title,
            description,
            joined_at,
            graduated_at,
            user_id: req.user.id,
            organization_id
        };
        try {
            await Education.create(newEducation);
            return res.status(200).json({ data: newEducation, success: true });
        } catch (e) {
            return handleError(res, e, 'Cannot create education.');
        }
    };

    public update = async (req: Request, res: Response) => {
        const { education_id } = req.params;
        const {
            title,
            description,
            joined_at,
            graduated_at,
            organization_id
        } = req.body;
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
                    await Education.updateOne(
                        { _id: education_id },
                        { $set: updateEducation },
                        { omitUndefined: true }
                    );
                    return res
                        .status(200)
                        .json({ data: updateEducation, success: true });
                }
                return res.status(401).json({
                    message: 'Unauthorized to update education',
                    success: false
                });
            }
            return res.status(200).json({
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
                    await Education.findByIdAndDelete(education_id);
                    return res.status(200).json({ success: true });
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
