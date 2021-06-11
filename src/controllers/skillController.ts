import { Request, Response } from 'express';
import { Skill } from '../models/Skill';
import handleError from '../utils/handleError';

class SkillController {
    public getAllByUserId = async (req: Request, res: Response) => {
        const { user_id } = req.params;
        try {
            const skills = await Skill.find({ user_id })
                .sort({ votes: -1 })
                .exec();
            return res.status(200).json({ data: skills, success: true });
        } catch (e) {
            return handleError(res, e, 'Cannot get skills by user id.');
        }
    };
    public create = async (req: Request, res: Response) => {
        const { name } = req.body;
        const newSkill = name.map((item: any) => {
            return {
                name: item,
                user_id: req.user.id
            };
        });
        try {
            const result = await Skill.insertMany(newSkill);
            return res.status(200).json({ data: result, success: true });
        } catch (e) {
            return handleError(res, e, 'Cannot create skill.');
        }
    };
    public update = async (req: Request, res: Response) => {
        const { skill_id } = req.params;
        const { name } = req.body;

        let updateSkill = { name };
        try {
            const skill: any = await Skill.findById(skill_id);
            if (skill) {
                const result = await Skill.findOneAndUpdate(
                    { _id: skill_id },
                    { $set: updateSkill },
                    { omitUndefined: true, new: true }
                );
                return res.status(200).json({ data: result, success: true });
            }
            return res.status(404).json({
                message: 'Skill not found.',
                success: false
            });
        } catch (e) {
            return handleError(res, e, 'Cannot update skill.');
        }
    };

    public upvote = async (req: Request, res: Response) => {
        const { skill_id } = req.params;
        try {
            const skill: any = await Skill.findById(skill_id);
            if (skill) {
                const result = await Skill.findOneAndUpdate(
                    { _id: skill_id },
                    { $set: { votes: `${(skill.votes += 1)}` } },
                    { omitUndefined: true, new: true }
                );
                return res.status(200).json({ data: result, success: true });
            }
            return res.status(404).json({
                message: 'Skill not found.',
                success: false
            });
        } catch (e) {
            return handleError(res, e, 'Cannot update skill.');
        }
    };

    public delete = async (req: Request, res: Response) => {
        const { skill_id } = req.params;
        try {
            const skill: any = await Skill.findById(skill_id);
            if (skill) {
                if (skill.user_id.equals(req.user.id)) {
                    const result = await Skill.findByIdAndDelete(skill_id);
                    return res
                        .status(200)
                        .json({ data: result, success: true });
                }
                return res.status(401).json({
                    message: 'Unauthorized to delete skill.',
                    success: false
                });
            }
        } catch (e) {
            return handleError(res, e, 'Cannot delete skill.');
        }
    };
}

export const skillController = new SkillController();
