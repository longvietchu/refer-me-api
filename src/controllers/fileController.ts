import { Request, Response } from 'express';
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import handleError from '../utils/handleError';

class FileController {
    public uploadSingle = async (req: Request, res: Response) => {
        // if (req.body.image) {
        //     return res.status(200).json({
        //         url: req.body.image,
        //         success: true
        //     });
        // }
        // return res
        //     .status(400)
        //     .json({ message: 'Error: Cannot upload image!', success: false });
        if (!req.file)
            return res.status(400).json({
                message: 'No image in request!',
                success: false
            });
        const fileStr = req.file.path;
        try {
            const uploadResponse = await cloudinary.uploader.upload(fileStr, {
                quality: 50
            });
            // console.log(uploadResponse);
            return res.status(200).json({
                url: uploadResponse.url,
                success: true
            });
        } catch (e) {
            return handleError(res, e, 'Error: Cannot upload image!');
        }
    };

    getImagesUrl = (images: any) => {
        const imagesUrl = images.map((image: any) => {
            return `${process.env.IMG_HOST}/${image}`;
        });
        return imagesUrl;
    };

    public uploadMultiple = async (req: Request, res: Response) => {
        // const images = this.getImagesUrl(req.body.images);
        // if (images) {
        //     return res.status(200).json({
        //         url: images,
        //         success: true
        //     });
        // }
        // return res
        //     .status(400)
        //     .json({ message: 'Error: Cannot upload images!', success: false });
        let imageFiles = req.files;
        if (!imageFiles) {
            return res
                .status(400)
                .json({ message: 'No image attached!', success: false });
        }
        try {
            // @ts-ignore
            let multipleImagePromise = imageFiles.map(
                (image: Express.Multer.File) =>
                    cloudinary.uploader.upload(image.path, {
                        quality: 50
                    })
            );
            let uploadResponses = await Promise.all(multipleImagePromise);
            let imageResponses = uploadResponses.map(
                (upload: UploadApiResponse) => upload.url
            );
            return res
                .status(200)
                .json({ images: imageResponses, success: true });
        } catch (e) {
            return handleError(res, e, 'Error: Cannot upload images!');
        }
    };
}

export const fileController = new FileController();
