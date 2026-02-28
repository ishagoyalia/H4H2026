const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');

// Get matches for a user
router.get('/matches/:userId', matchController.getMatches);

// Create a new match
router.post('/matches', matchController.createMatch);

module.exports = router;
