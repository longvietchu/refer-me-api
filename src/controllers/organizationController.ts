import { Request, Response } from 'express';
import { Organization } from '../models/Organization';
import errorHandler from '../utils/errorHandler';

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
        let newOrganization = {
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
            return res.status(200).json(newOrganization);
        } catch (e) {
            return errorHandler(res, e, 'Cannot create organization.');
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
        let updateOrganization = {
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
            const organization: any = await Organization.findOne({
                _id: organization_id
            });
            if (organization) {
                if (organization.user_id.equals(req.user.id)) {
                    await Organization.updateOne(
                        { _id: organization_id },
                        { $set: updateOrganization },
                        { omitUndefined: true }
                    );
                    return res.status(200).json(updateOrganization);
                }
                return res.status(401).json({
                    msg: 'You do not have right to update this organization'
                });
            }
            return res.status(200).json({
                msg: 'Organization not found.'
            });
        } catch (e) {
            return errorHandler(res, e, 'Cannot update organization.');
        }
    };

    public getOrganization = async (req: Request, res: Response) => {
        const { organization_id } = req.params;
        try {
            const organization = await Organization.findOne({
                _id: organization_id
            });
            if (organization) {
                const {
                    name,
                    avatar,
                    background_image,
                    description,
                    website,
                    industry,
                    company_size,
                    founded
                }: any = organization;
                return res.status(200).json({
                    organization: {
                        name,
                        avatar,
                        background_image,
                        description,
                        website,
                        industry,
                        company_size,
                        founded
                    }
                });
            }
            return res
                .status(400)
                .json({ msg: 'Organization does not exist.' });
        } catch (e) {
            return errorHandler(res, e, 'Cannot get Organization.');
        }
    };

    public getAll = async (req: Request, res: Response) => {
        try {
            const organization = await Organization.find();
            if (organization) {
                const responseOrganization = organization.map(
                    ({
                        name,
                        avatar,
                        background_image,
                        description,
                        website,
                        industry,
                        company_size,
                        founded
                    }: any) => {
                        return {
                            name,
                            avatar,
                            background_image,
                            description,
                            website,
                            industry,
                            company_size,
                            founded
                        };
                    }
                );
                res.status(200).json({ organizations: responseOrganization });
            }
        } catch (e) {
            return errorHandler(res, e, 'Have no organization');
        }
    };
}

export const organizationController = new OrganizationController();
