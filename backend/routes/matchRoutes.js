import express from 'express';
import * as matchController from '../controllers/matchController.js';

const router = express.Router();

// GET matches for a specific user
// When the frontend calls: GET /api/matches/123
// Express will extract "123" and store it in req.params.userId
router.get('/matches/:userId', matchController.getMatches);

export default router;