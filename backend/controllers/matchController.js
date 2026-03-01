import * as matchAlgorithm from '../algorithms/interestsAlgorithm.js';
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

    // Fetch real user data from Firebase
    const userProfile = await userService.getUserProfile(userId);

    if (!userProfile) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Build user object with Firebase data
    const user = {
      id: userId,
      ...userProfile,
    };

    // Fetch Google Calendar availability if user has it connected
    try {
      const calendarData = await scheduleMatchService.getUserAvailability(userId);
      user.availability = calendarData.availability;
    } catch (error) {
      // User doesn't have Google Calendar connected or no tokens
      // Use manual availability from profile or empty array
      console.log(`No Google Calendar for user ${userId}, using manual availability`);
      user.availability = userProfile.availability || [];
    }

    // Fetch all other users from Firebase
    const allUsers = await userService.getAllUsers();

    // Fetch Google Calendar availability for each user if available
    for (const otherUser of allUsers) {
      try {
        const calendarData = await scheduleMatchService.getUserAvailability(otherUser.id);
        otherUser.availability = calendarData.availability;
      } catch (error) {
        // User doesn't have Google Calendar - use manual availability
        otherUser.availability = otherUser.availability || [];
      }
    }

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
    matches = combinedScore.findBestMatches(user, allUsers, weights);

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
