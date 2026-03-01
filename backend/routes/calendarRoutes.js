import express from 'express';
import * as calendarController from '../controllers/calendarController.js';

const router = express.Router();

router.get('/auth/google', calendarController.getAuthUrl);
router.get('/auth/google/callback', calendarController.oauthCallback);
router.get('/users/:userId/calendar/events', calendarController.getEvents);

export default router;
