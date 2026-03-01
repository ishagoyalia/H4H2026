// Import Express
const express = require("express");

// Create router for user-related endpoints
const router = express.Router();

// Import controller functions that handle user data
const {
    createOrUpdateUser,
    getUserProfile,
    getAllUsers,
} = require("../controllers/userControllers");


// Create or update a user profile
// Frontend sends user data in request body
// POST /api/users
router.post("/", createOrUpdateUser);


// Get a specific user's profile
// GET /api/users/123
// "123" will be available as req.params.userId
router.get("/:userId", getUserProfile);


// Get all users (useful for matching or admin tools)
// GET /api/users
router.get("/", getAllUsers);


// Export router so it can be mounted in server.js
module.exports = router;