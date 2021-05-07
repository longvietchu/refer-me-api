import { Request, Response } from 'express';
import { Job } from '../models/Job';
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
            const job: any = await Job.findById(job_id);
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
                .sort({ created_at: 'asc' })
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
            const job: any = await Job.findById(job_id);
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
                .sort({ created_at: 'asc' })
                .limit(limit)
                .skip(limit * page)
                .exec();
            const total_record = await Job.countDocuments();
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
}

export const jobController = new JobController();
