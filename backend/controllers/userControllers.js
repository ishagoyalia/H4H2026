// userControllers.js - handles HTTP requests for user operations
import * as userService from '../userService.js';

// Create or update a user profile
export async function createOrUpdateUser(req, res) {
    try {
        const { userId, ...profileData } = req.body;

        if (!userId) {
            return res.status(400).json({
                success: false,
                error: 'userId is required'
            });
        }

        // Check if onboarding is complete (has interests and MBTI)
        const hasInterests = profileData.interests && Array.isArray(profileData.interests) && profileData.interests.length > 0;
        const hasMBTI = profileData.mbti && typeof profileData.mbti === 'string';

        // If providing interests and MBTI, mark onboarding complete
        if (hasInterests && hasMBTI) {
            profileData.onboardingComplete = true;
            profileData.updatedAt = new Date().toISOString();
        }

        await userService.saveUserProfile(userId, profileData);

        res.json({
            success: true,
            message: 'User profile saved successfully',
            userId,
            onboardingComplete: profileData.onboardingComplete || false
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

// Get a specific user's profile
export async function getUserProfile(req, res) {
    try {
        const { userId } = req.params;

        const profile = await userService.getUserProfile(userId);

        if (!profile) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        res.json({
            success: true,
            user: { id: userId, ...profile }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

// Get all users
export async function getAllUsers(req, res) {
    try {
        const users = await userService.getAllUsers();

        res.json({
            success: true,
            count: users.length,
            users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}
