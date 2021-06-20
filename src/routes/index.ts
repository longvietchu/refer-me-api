import express from 'express';
import userRoute from './userRoute';
import authRoute from './authRoute';
import profileRoute from './profileRoute';
import organizationRoute from './organizationRoute';
import educationRoute from './educationRoute';
import experienceRoute from './experienceRoute';
import fileRoute from './fileRoute';
import skillRoute from './skillRoute';
import jobRoute from './jobRoute';
import connectionRoute from './connectionRoute';
import roomRoute from './roomRoute';
import postRoute from './postRoute';
import notificationRoute from './notificationRoute';

const router = express.Router();

router.use('/user', userRoute);
router.use('/auth', authRoute);
router.use('/profile', profileRoute);
router.use('/organization', organizationRoute);
router.use('/education', educationRoute);
router.use('/experience', experienceRoute);
router.use('/file', fileRoute);
router.use('/skill', skillRoute);
router.use('/job', jobRoute);
router.use('/post', postRoute);
router.use('/connection', connectionRoute);
router.use('/room', roomRoute);
router.use('/notification', notificationRoute);

export default router;
