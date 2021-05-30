import { Request, Response } from 'express';
import { Applicant } from '../models/Applicant';
import { Job } from '../models/Job';
import { User } from '../models/User';
import handleError from '../utils/handleError';

class JobController {
    public create = async (req: Request, res: Response) => {
        const {
            title,
            location,
            description,
            seniority_level,
            employment_type,
            industry,
            job_functions,
            organization_id
        } = req.body;
        const newJob = {
            title,
            location,
            description,
            seniority_level,
            employment_type,
            industry,
            job_functions,
            organization_id,
            user_id: req.user.id
        };
        try {
            await Job.create(newJob);
            return res.status(200).json({ data: newJob, success: true });
        } catch (e) {
            return handleError(res, e, 'Cannot create job.');
        }
    };

    public update = async (req: Request, res: Response) => {
        const { job_id } = req.params;
        const {
            title,
            location,
            description,
            seniority_level,
            employment_type,
            industry,
            job_functions,
            organization_id
        } = req.body;
        const updateJob = {
            title,
            location,
            description,
            seniority_level,
            employment_type,
            industry,
            job_functions,
            organization_id
        };
        try {
            const job: any = await Job.findById(job_id).exec();
            if (job) {
                if (job.user_id.equals(req.user.id)) {
                    await Job.updateOne(
                        { _id: job_id },
                        { $set: updateJob },
                        { omitUndefined: true }
                    );
                    return res
                        .status(200)
                        .json({ data: updateJob, success: true });
                }
                return res.status(401).json({
                    message: 'Unauthorized to update job',
                    success: false
                });
            }
            return res.status(404).json({
                message: 'Job not found.',
                success: false
            });
        } catch (e) {
            return handleError(res, e, 'Cannot update job.');
        }
    };

    public getOne = async (req: Request, res: Response) => {
        const { job_id } = req.params;
        try {
            const job = await Job.findById(
                job_id,
                'title location description seniority_level employment_type industry job_functions organization_id'
            ).exec();
            if (job) {
                return res.status(200).json({
                    data: job,
                    success: true
                });
            }
            return res.status(400).json({
                message: 'Job does not exist.',
                success: false
            });
        } catch (e) {
            return handleError(res, e, 'Cannot get job.');
        }
    };

    public getAll = async (req: Request, res: Response) => {
        const page = parseInt(req.query.page as string) || 0;
        const limit = parseInt(req.query.limit as string) || 10;
        try {
            const jobs = await Job.find({})
                .sort({ created_at: 'desc' })
                .select(
                    'title location description seniority_level employment_type industry job_functions organization_id user_id created_at updated_at'
                )
                .limit(limit)
                .skip(limit * page)
                .exec();
            const total_record = await Job.countDocuments();
            if (jobs) {
                res.status(200).json({
                    data: jobs,
                    success: true,
                    meta: {
                        page_index: page,
                        page_size: limit,
                        total_record,
                        total_page: Math.ceil(total_record / limit)
                    }
                });
            }
        } catch (e) {
            return handleError(res, e, 'Cannot get jobs.');
        }
    };

    public delete = async (req: Request, res: Response) => {
        const { job_id } = req.params;
        try {
            const job: any = await Job.findById(job_id).exec();
            if (job) {
                if (job.user_id.equals(req.user.id)) {
                    await Job.deleteOne({ _id: job_id });
                    return res.status(200).json({ success: true });
                }
                return res.status(401).json({
                    message: 'Unauthorized to delete job.',
                    success: false
                });
            }
            return res.status(400).json({
                message: 'Job not found.',
                success: false
            });
        } catch (e) {
            return handleError(res, e, 'Cannot delete job.');
        }
    };

    public search = async (req: Request, res: Response) => {
        const keyword = req.query.keyword as string;
        const page = parseInt(req.query.page as string) || 0;
        const limit = parseInt(req.query.limit as string) || 10;
        try {
            const jobs = await Job.find({
                title: { $regex: new RegExp(keyword), $options: 'ix' }
            })
                .sort({ created_at: 'desc' })
                .limit(limit)
                .skip(limit * page)
                .exec();
            const total_record = jobs.length;
            if (jobs) {
                return res.status(200).json({
                    data: jobs,
                    success: true,
                    meta: {
                        page_index: page,
                        page_size: limit,
                        total_record,
                        total_page: Math.ceil(total_record / limit)
                    }
                });
            }
            return res.status(400).json({
                message: 'Job not found.',
                success: false
            });
        } catch (e) {
            return handleError(res, e, 'Cannot search jobs.');
        }
    };
    public getAllApplicants = async (req: Request, res: Response) => {
        const job_id = req.query.job_id;
        const page = parseInt(req.query.page as string) || 0;
        const limit = parseInt(req.query.limit as string) || 10;

        try {
            const job: any = await Job.findById(job_id).exec();
            if (job.user_id.equals(req.user.id)) {
                const applicants = await Applicant.aggregate([
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'user_id',
                            foreignField: '_id',
                            as: 'user'
                        }
                    },
                    {
                        $unwind: '$user'
                    },
                    {
                        $project: {
                            'user.role': 0,
                            'user.password': 0,
                            'user.created_at': 0,
                            'user.updated_at': 0
                        }
                    }
                ])
                    .sort({ created_at: 'desc' })
                    .limit(limit)
                    .skip(limit * page)
                    .exec();
                const total_record = applicants.length;
                return res.status(200).json({
                    data: applicants,
                    success: true,
                    meta: {
                        page_index: page,
                        page_size: limit,
                        total_record,
                        total_page: Math.ceil(total_record / limit)
                    }
                });
            }
            return res.status(401).json({
                message: 'Unauthorized to get applicants',
                success: false
            });
        } catch (e) {
            return handleError(res, e, 'Cannot get applicants.');
        }
    };
    public applyJob = async (req: Request, res: Response) => {
        const { job_id } = req.params;
        const { greeting } = req.body;
        const newApplicant = {
            greeting,
            user_id: req.user.id,
            job_id
        };
        try {
            await Applicant.create(newApplicant);
            return res.status(200).json({ data: newApplicant, success: true });
        } catch (e) {
            return handleError(res, e, 'Cannot create applicants.');
        }
    };
    public unApply = async (req: Request, res: Response) => {
        const { job_id } = req.params;
        try {
            const applicant: any = await Applicant.findOne({ job_id }).exec();
            if (applicant) {
                if (applicant.user_id.equals(req.user.id)) {
                    await Applicant.findByIdAndDelete(applicant.id);
                    return res.status(200).json({ success: true });
                }
                return res.status(401).json({
                    message: 'Unauthorized to delete applicant.',
                    success: false
                });
            }
            return res.status(400).json({
                message: 'Applicant not found.',
                success: false
            });
        } catch (e) {
            return handleError(res, e, 'Cannot delete applicant.');
        }
    };
}

export const jobController = new JobController();
