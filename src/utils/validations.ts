import { check } from 'express-validator';

export const registerValidation = [
    check('name', 'Tên không được để trống').trim().not().isEmpty(),
    check('email', 'Sai định dạng email').isEmail(),
    check('password', 'Mật khẩu phải có ít nhất 6 kí tự').isLength({
        min: 6
    })
];

export const loginValidation = [
    check('email', 'Sai định dạng email').isEmail(),
    check('password', 'Mật khẩu không được để trống').trim().not().isEmpty()
];

export const createEducation = [
    check('title', 'Tên học vấn không được để trống').trim().not().isEmpty()
];

export const createExperience = [
    check('job_title', 'Chức danh công việc không được để trống')
        .trim()
        .not()
        .isEmpty(),
    check('company', 'Tên công ty không được để trống').trim().not().isEmpty()
];
