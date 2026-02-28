const googleCalendar = require('../utils/googleCalendar');
const tokenStore = require('../utils/tokenStore');
const calendarProcessor = require('../utils/calendarProcessor');
const gcalAlgorithm = require('../algorithms/gcalAlgorithm');

// Return an auth URL to start OAuth flow
exports.getAuthUrl = (req, res) => {
  try {
    const url = googleCalendar.generateAuthUrl();
    res.json({ success: true, url });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Callback to exchange code and save tokens for a user
exports.oauthCallback = async (req, res) => {
  try {
    const code = req.query.code;
    const userId = req.query.state || req.query.userId || 'test-user';
    if (!code) return res.status(400).json({ success: false, error: 'Missing code' });

    const tokens = await googleCalendar.getTokensFromCode(code);
    tokenStore.saveTokens(userId, tokens);

    res.json({ success: true, message: 'Tokens saved', userId });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get upcoming events for a saved user
exports.getEvents = async (req, res) => {
  try {
    const { userId } = req.params;
    const tokens = tokenStore.getTokens(userId);
    if (!tokens) return res.status(404).json({ success: false, error: 'No tokens for this user' });

    const now = new Date().toISOString();
    const events = await googleCalendar.listEvents(tokens, { timeMin: now, maxResults: 50 });

    res.json({ success: true, events });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get time compatibility between two users
exports.getTimeCompatibility = async (req, res) => {
  try {
    const { userId1, userId2 } = req.params;

    // Get availability for both users
    const availability1 = await calendarProcessor.getUserAvailability(userId1);
    const availability2 = await calendarProcessor.getUserAvailability(userId2);

    if (!availability1 || !availability2) {
      return res.status(404).json({
        success: false,
        error: 'Could not fetch calendar data for one or both users',
      });
    }

    // Create user objects with availability
    const user1 = { id: userId1, availability: availability1 };
    const user2 = { id: userId2, availability: availability2 };

    // Calculate compatibility
    const compatibility = gcalAlgorithm.calculateScheduleCompatibility(user1, user2);

    // Format overlapping slots as [[date], [times]]
    const twoWeekMatches = compatibility.overlappingSlots
      .slice(0, 14) // First 2 weeks max
      .map(slot => ({
        date: slot.day,
        timeRange: `${slot.startTime} - ${slot.endTime}`,
        duration: `${slot.duration.toFixed(1)}h`,
      }));

    res.json({
      success: true,
      userId1,
      userId2,
      compatibility: {
        timeScore: Math.round(compatibility.score),
        totalOverlapHours: compatibility.totalOverlapHours.toFixed(1),
        matchingTimes: twoWeekMatches,
      },
      rawAvailability1: availability1,
      rawAvailability2: availability2,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
