const express = require('express');
const router = express.Router();
const calendarController = require('../controllers/calendarController');

router.get('/auth/google', calendarController.getAuthUrl);
router.get('/auth/google/callback', calendarController.oauthCallback);
router.get('/users/:userId/calendar/events', calendarController.getEvents);
router.get('/users/:userId1/compatibility/:userId2', calendarController.getTimeCompatibility);

module.exports = router;
