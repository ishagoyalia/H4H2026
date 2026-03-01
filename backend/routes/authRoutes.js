// authRoutes.js - authentication endpoints
import express from 'express';
import * as authController from '../controllers/authController.js';

const router = express.Router();

// POST /api/auth/signup - Create new account
router.post('/signup', authController.signup);

// POST /api/auth/login - Login to existing account
router.post('/login', authController.login);

// GET /api/auth/check/:userId - Check if user exists and onboarding status
router.get('/check/:userId', authController.checkUser);

export default router;
