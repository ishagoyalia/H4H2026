<<<<<<< Updated upstream
// const express = require('express');
// const router = express.Router();
// const matchController = require('../controllers/matchController');

// // Get matches for a user
// router.get('/matches/:userId', matchController.getMatches);

// // Create a new match
// router.post('/matches', matchController.createMatch);

// module.exports = router;

//*********************************************************************** */

// Import Express so we can create routes
const express = require("express");

// Create a router object (like a mini server just for matches)
const router = express.Router();
=======
import express from 'express';
const router = express.Router();
import * as matchController from '../controllers/matchController.js';
>>>>>>> Stashed changes

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

<<<<<<< Updated upstream

// OPTIONAL route for getting a random match
// Example request: GET /api/matches/random/123
router.get("/random/:userId", getRandomMatch);


// Export this router so server.js can use it
module.exports = router;
=======
export default router;
>>>>>>> Stashed changes
