// calendarController.js - handles routes for calendar integration (OAuth and events)
import * as googleCalendar from '../algorithms/googleCalendar.js';
import * as tokenStore from '../algorithms/tokenStore.js';
import * as userService from '../userService.js'; // To update user profile with calendar info
import * as gcalAlgorithm from '../algorithms/gcalAlgorithm.js'; // To calculate free slots from events

// Return an auth URL to start OAuth flow
export function getAuthUrl(req, res) {
  try {
    const url = googleCalendar.generateAuthUrl();
    res.json({ success: true, url });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Callback to exchange code and save tokens for a user
export async function oauthCallback(req, res) {
  try {
    const code = req.query.code;
    const userId = req.query.state || req.query.userId || 'test-user';
    if (!code) return res.status(400).json({ success: false, error: 'Missing code' });

    const tokens = await googleCalendar.getTokensFromCode(code);

    // 2. Fetch the busy events immediately
    const now = new Date().toISOString();
    const rawEvents = await googleCalendar.listEvents(tokens, { timeMin: now, maxResults: 100 });

    // 3. TRANSFORM: Turn raw Google events into "Free Slots"
    // Import gcalAlgorithm at the top of this file to use this
    const freeSlots = gcalAlgorithm.calculateFreeSlots(rawEvents);

    await tokenStore.saveTokens(userId, tokens);
    await userService.updateUserProfile(userId, {
      availability: freeSlots,
      calendarConnected: true
    });

    res.json({ success: true, message: /*'Tokens saved', userId, freeSlots }*/'Google Calendar connected successfully', userId });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get upcoming events for a saved user LISTEVENTS OR CALENDAR.FREEBUSY
export async function getEvents(req, res) {
  try {
    const { userId } = req.params;
    const tokens = await tokenStore.getTokens(userId);
    if (!tokens) return res.status(404).json({ success: false, error: 'No tokens for this user' });

    const now = new Date().toISOString();
    // LISTEVENTS returns detailed event info, FREEBUSY returns only busy time slots. Adjust as needed.
    const events = await googleCalendar.listEvents(tokens, { timeMin: now, maxResults: 50 });

    res.json({ success: true, events });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
