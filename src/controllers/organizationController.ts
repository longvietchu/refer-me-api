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
            await Organization.create(newOrganization);
            return res
                .status(200)
                .json({ data: newOrganization, success: true });
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
                    await Organization.updateOne(
                        { _id: organization_id },
                        { $set: updateOrganization },
                        { omitUndefined: true }
                    );
                    return res
                        .status(200)
                        .json({ data: updateOrganization, success: true });
                }
                return res.status(401).json({
                    message: 'Unauthorized to update organization',
                    success: false
                });
            }
            return res.status(200).json({
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
            const organization = await Organization.findById(
                organization_id,
                'name avatar background_image description website industry company_size founded'
            );
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
        try {
            const organizations = await Organization.find(
                {},
                'name avatar background_image description website industry company_size founded'
            ).exec();
            const total_record = await Organization.countDocuments();
            if (organizations) {
                res.status(200).json({
                    data: organizations,
                    success: true,
                    meta: {
                        total_record
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
                    await Organization.deleteOne({ _id: organization_id });
                    return res.status(200).json({ success: true });
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
}

export const organizationController = new OrganizationController();
