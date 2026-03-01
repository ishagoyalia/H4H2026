import * as combinedScore from '../algorithms/combinedScore.js';
import * as userService from '../userService.js';
import * as scheduleMatchService from '../services/scheduleMatchService.js';

// Get matches for a user with custom weights
export async function getMatches(req, res) {
  try {
    const { userId } = req.params;

    // Get optional weight parameters from query string
    // Example: /api/matches/123?interests=50&schedule=30&mbti=20
    const { interests, schedule, mbti, preference } = req.query;

    // Fetch current user profile from database
    const user = await userService.getUserProfile(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Fetch current user's Google Calendar availability
    try {
      const userAvailability = await scheduleMatchService.getUserAvailability(userId);
      user.availability = userAvailability.availability;
    } catch (err) {
      // User hasn't authorized calendar, use empty availability
      console.warn(`No calendar availability for user ${userId}:`, err.message);
      user.availability = [];
    }
    user.id = userId;

    // Fetch all other users from database
    let allUsers = await userService.getAllUsers();
    allUsers = allUsers.filter(u => u.id !== userId);

    // Fetch Google Calendar availability for each user
    const enrichedUsers = await Promise.all(
      allUsers.map(async (otherUser) => {
        try {
          const availability = await scheduleMatchService.getUserAvailability(otherUser.id);
          return { ...otherUser, availability: availability.availability };
        } catch (err) {
          // User hasn't authorized calendar, use empty availability
          console.warn(`No calendar availability for user ${otherUser.id}:`, err.message);
          return { ...otherUser, availability: [] };
        }
      })
    );

    let matches;
    let weights = null;

    // Determine which weights to use based on user input
    if (interests && schedule && mbti) {
      // User provided custom percentages via sliders
      weights = combinedScore.createCustomWeights(
        parseFloat(interests),
        parseFloat(schedule),
        parseFloat(mbti)
      );
    } else if (preference) {
      // User selected a preset preference
      weights = combinedScore.getWeightsByPreference(preference);
    }

    // Get combined matches with weights (or default if no weights provided)
    matches = combinedScore.findBestMatches(user, enrichedUsers, weights);

    res.json({
      success: true,
      matches,
      weightsUsed: weights || 'default',
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Create a new match
export async function createMatch(req, res) {
  try {
    const { userId1, userId2 } = req.body;

    // Logic to create a match connection
    const match = { userId1, userId2, createdAt: new Date() };

    res.json({ success: true, match });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
