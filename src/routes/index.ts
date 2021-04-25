import express from 'express';
import userRoute from './userRoute';
import authRoute from './authRoute';
import profileRoute from './profileRoute';
import organizationRoute from './organizationRoute';

const router = express.Router();

router.use('/user', userRoute);
router.use('/auth', authRoute);
router.use('/profile', profileRoute);
router.use('/organization', organizationRoute);

export default router;
