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
        try {
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

            // Create
            await Organization.create(newOrganization);
            return res.status(200).json(newOrganization);
        } catch (e) {
            console.log(e);
            return errorHandler(res, e, 'Cannot create organization.');
        }
    };

    public update = async (req: Request, res: Response) => {
        const { organization_id } = req.params;
        try {
            const organization: any = Organization.findOne({
                id: organization_id
            });
            if (organization) {
                if (organization.user_id === req.user.id) {
                    await Organization.updateOne(organization);
                    return res.status(200).json(organization);
                }
            }
        } catch (e) {}
    };

    public getOrganization = async (req: Request, res: Response) => {
        const { organization_id } = req.params;
        try {
            const organization = Organization.findOne({ id: organization_id });
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
            console.log(e);
            return errorHandler(res, e, 'Cannot get Organization.');
        }
    };
}

export const organizationController = new OrganizationController();
