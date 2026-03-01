// Import Express so we can create routes
const express = require("express");

// Create a router object (like a mini server just for matches)
const router = express.Router();

// Import the controller functions that actually do the work
// These functions contain the matching logic or database calls
const {
    getMatches,
    getRandomMatch,
} = require("../controllers/matchControllers");


// GET matches for a specific user
// When the frontend calls: GET /api/matches/123
// Express will extract "123" and store it in req.params.userId
router.get("/:userId", getMatches);


// OPTIONAL route for getting a random match
// Example request: GET /api/matches/random/123
router.get("/random/:userId", getRandomMatch);


// Export this router so server.js can use it
module.exports = router;