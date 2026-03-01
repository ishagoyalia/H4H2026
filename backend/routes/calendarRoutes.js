import express from 'express';
import * as calendarController from '../controllers/calendarController.js';

const router = express.Router();

router.get('/auth', calendarController.getAuthUrl);
router.get('/auth/callback', calendarController.oauthCallback);
router.get('/:userId/events', calendarController.getEvents);

export default router;
