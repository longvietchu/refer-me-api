import { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const multerStorage = multer.memoryStorage();

const multerFilter = (req: Request, file: any, cb: any) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb('Please upload only images.', false);
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

const uploadFiles = upload.array('images', 10);

const uploadImages = (req: Request, res: Response, next: NextFunction) => {
    uploadFiles(req, res, function (err: any) {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                return res.send('Too many files to upload.');
            }
        } else if (err) {
            return res.send(err);
        }
        next();
    });
};

const resizeSingle = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.file) return next();
    const newFilename = `${
        uuidv4() + path.extname(req.file.originalname).toLowerCase()
    }`;
    await sharp(req.file.buffer)
        .toFormat('jpeg')
        .jpeg({ quality: 50 })
        .withMetadata()
        .toFile(`public/uploads/${newFilename}`);
    req.body.image = `${process.env.IMG_HOST}/${newFilename}`;
    next();
};

const resizeImages = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.files) return next();

    req.body.images = [];
    await Promise.all(
        // @ts-ignore
        req.files.map(async (file: any) => {
            const newFilename = `${
                uuidv4() + path.extname(file.originalname).toLowerCase()
            }`;

            await sharp(file.buffer)
                .toFormat('jpeg')
                .jpeg({ quality: 50 })
                .withMetadata()
                .toFile(`public/uploads/${newFilename}`);

            req.body.images.push(newFilename);
            // console.log(file.buffer);
        })
    );

    next();
};

const getResult = async (req: Request, res: Response) => {
    const imagesUrl = req.body.images.map((image: any) => {
        return `${process.env.IMG_HOST}/${image}`;
    });
    // return res.status(200).json({ imagesUrl, success: true });
    return imagesUrl;
};

export default {
    upload,
    uploadImages,
    resizeImages,
    getResult,
    resizeSingle
};
