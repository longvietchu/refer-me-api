import { Request, Response } from 'express';
import { Organization } from '../models/Organization';
import handleError from '../utils/handleError';

class OrganizationController {
    public create = async (req: Request, res: Response) => {
        const {
            name,
            avatar,
            background_image,
            description,
            website,
            industry,
            company_size,
            founded
        } = req.body;
        const newOrganization = {
            name,
            avatar,
            background_image,
            description,
            website,
            industry,
            company_size,
            founded,
            user_id: req.user.id
        };
        try {
            // Create
            const result = await Organization.create(newOrganization);
            return res.status(200).json({ data: result, success: true });
        } catch (e) {
            return handleError(res, e, 'Cannot create organization.');
        }
    };

    public update = async (req: Request, res: Response) => {
        const { organization_id } = req.params;
        const {
            name,
            avatar,
            background_image,
            description,
            website,
            industry,
            company_size,
            founded
        } = req.body;
        const updateOrganization = {
            name,
            avatar,
            background_image,
            description,
            website,
            industry,
            company_size,
            founded
        };
        try {
            const organization: any = await Organization.findById(
                organization_id
            );
            if (organization) {
                if (organization.user_id.equals(req.user.id)) {
                    const result = await Organization.findOneAndUpdate(
                        { _id: organization_id },
                        { $set: updateOrganization },
                        { omitUndefined: true, new: true }
                    );
                    return res
                        .status(200)
                        .json({ data: result, success: true });
                }
                return res.status(401).json({
                    message: 'Unauthorized to update organization',
                    success: false
                });
            }
            return res.status(404).json({
                message: 'Organization not found.',
                success: false
            });
        } catch (e) {
            return handleError(res, e, 'Cannot update organization.');
        }
    };

    public getOne = async (req: Request, res: Response) => {
        const { organization_id } = req.params;
        try {
            const organization = await Organization.findById(organization_id);
            if (organization) {
                return res.status(200).json({
                    data: organization,
                    success: true
                });
            }
            return res.status(400).json({
                message: 'Organization does not exist.',
                success: false
            });
        } catch (e) {
            return handleError(res, e, 'Cannot get Organization.');
        }
    };

    public getAll = async (req: Request, res: Response) => {
        const page = parseInt(req.query.page as string) || 0;
        const limit = parseInt(req.query.limit as string) || 10;
        try {
            const organizations = await Organization.find()
                .sort({
                    created_at: 'desc'
                })
                .limit(limit)
                .skip(limit * page)
                .exec();
            const total_record = await Organization.countDocuments().exec();
            if (organizations) {
                res.status(200).json({
                    data: organizations,
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
            return handleError(res, e, 'Cannot get organizations.');
        }
    };

    public delete = async (req: Request, res: Response) => {
        const { organization_id } = req.params;
        try {
            const organization: any = await Organization.findById(
                organization_id
            );
            if (organization) {
                if (organization.user_id.equals(req.user.id)) {
                    const result = await Organization.deleteOne({
                        _id: organization_id
                    });
                    return res
                        .status(200)
                        .json({ data: result, success: true });
                }
                return res.status(401).json({
                    message: 'Unauthorized to delete organization.',
                    success: false
                });
            }
            return res.status(400).json({
                message: 'Organization not found.',
                success: false
            });
        } catch (e) {
            return handleError(res, e, 'Cannot delete organization.');
        }
    };

    public search = async (req: Request, res: Response) => {
        const keyword = req.query.keyword as string;
        const page = parseInt(req.query.page as string) || 0;
        const limit = parseInt(req.query.limit as string) || 10;
        try {
            const organizations = await Organization.find({
                name: { $regex: new RegExp(keyword), $options: 'ix' }
            })
                .sort({ created_at: -1 })
                .limit(limit)
                .skip(limit * page)
                .exec();
            const total_record = await Organization.countDocuments({
                name: { $regex: new RegExp(keyword), $options: 'ix' }
            }).exec();
            if (organizations) {
                return res.status(200).json({
                    data: organizations,
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
                message: 'Organization not found.',
                success: false
            });
        } catch (e) {
            return handleError(res, e, 'Cannot search organizations.');
        }
    };

    public getOrgOfUser = async (req: Request, res: Response) => {
        const user_id = req.query.user_id as string;
        const page = parseInt(req.query.page as string) || 0;
        const limit = parseInt(req.query.limit as string) || 10;
        try {
            const organizations = await Organization.find({ user_id })
                .sort({
                    created_at: -1
                })
                .limit(limit)
                .skip(limit * page)
                .exec();
            const total_record = await Organization.countDocuments({
                user_id
            }).exec();
            return res.status(200).json({
                data: organizations,
                success: true,
                meta: {
                    page_index: page,
                    page_size: limit,
                    total_record,
                    total_page: Math.ceil(total_record / limit)
                }
            });
        } catch (e) {
            return handleError(res, e, 'Cannot get my organizations.');
        }
    };
}

export const organizationController = new OrganizationController();
