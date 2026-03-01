// Import Express
import express from 'express';
import * as userControllers from '../controllers/userControllers.js';

// Create router for user-related endpoints
const router = express.Router();


// Create or update a user profile
// Frontend sends user data in request body
// POST /api/users
router.post("/", userControllers.createOrUpdateUser);


// Get a specific user's profile
// GET /api/users/123
// "123" will be available as req.params.userId
router.get("/:userId", userControllers.getUserProfile);


// Get all users (useful for matching or admin tools)
// GET /api/users
router.get("/", userControllers.getAllUsers);


// Export router so it can be mounted in server.js
export default router;