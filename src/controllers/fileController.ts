import { Request, Response } from 'express';

class FileController {
    public uploadSingle = (req: Request, res: Response) => {
        if (req.body.image) {
            return res.status(200).json({
                url: req.body.image,
                success: true
            });
        }
        return res
            .status(400)
            .json({ message: 'Error: Cannot upload image!', success: false });
    };

    getImagesUrl = (images: any) => {
        const imagesUrl = images.map((image: any) => {
            return `${process.env.IMG_HOST}/${image}`;
        });
        return imagesUrl;
    };

    public uploadMultiple = async (req: Request, res: Response) => {
        const images = this.getImagesUrl(req.body.images);
        if (images) {
            return res.status(200).json({
                url: images,
                success: true
            });
        }
        return res
            .status(400)
            .json({ message: 'Error: Cannot upload images!', success: false });
    };
}

export const fileController = new FileController();
