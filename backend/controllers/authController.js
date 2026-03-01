// authController.js - handles user authentication with Firebase Auth
import { auth } from '../firebase.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import * as userService from '../userService.js';

/**
 * Sign up a new user with email/password
 * Creates Firebase Auth account and returns userId
 * Frontend should then collect profile data (interests, MBTI) and POST to /api/users
 * POST /api/auth/signup
 * Body: { email, password, name }
 */
export async function signup(req, res) {
    try {
        const { email, password, name } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Email and password are required'
            });
        }

        // Create Firebase Auth user
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const userId = userCredential.user.uid;

        // Create basic user profile with name
        await userService.saveUserProfile(userId, {
            email,
            name: name || email.split('@')[0],
            createdAt: new Date().toISOString(),
            onboardingComplete: false
        });

        res.json({
            success: true,
            message: 'Account created successfully',
            userId,
            onboardingComplete: false
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(400).json({
            success: false,
            error: error.message || 'Failed to create account'
        });
    }
}

/**
 * Log in existing user
 * POST /api/auth/login
 * Body: { email, password }
 */
export async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Email and password are required'
            });
        }

        // Sign in with Firebase Auth
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const userId = userCredential.user.uid;

        // Check if user has completed onboarding
        const profile = await userService.getUserProfile(userId);
        const onboardingComplete = profile?.onboardingComplete || false;

        res.json({
            success: true,
            message: 'Logged in successfully',
            userId,
            onboardingComplete,
            profile: profile || null
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(401).json({
            success: false,
            error: 'Invalid email or password'
        });
    }
}

/**
 * Check if user exists and onboarding status
 * GET /api/auth/check/:userId
 */
export async function checkUser(req, res) {
    try {
        const { userId } = req.params;

        const profile = await userService.getUserProfile(userId);

        if (!profile) {
            return res.status(404).json({
                success: false,
                exists: false,
                onboardingComplete: false
            });
        }

        res.json({
            success: true,
            exists: true,
            onboardingComplete: profile.onboardingComplete || false,
            profile
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}
