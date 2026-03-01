import * as combinedScore from '../algorithms/combinedScore.js';
import * as userService from '../userService.js';

// Get matches for a user with custom weights
export async function getMatches(req, res) {
  try {
    const { userId } = req.params;
    const { interests, schedule, mbti, preference } = req.query;

    // 1. Fetch current user and all other users
    // Since we now cache availability in the profile, these objects 
    // already contain the "freeSlots" we need.
    const userProfile = await userService.getUserProfile(userId);
    if (!userProfile) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const user = { id: userId, ...userProfile };
    const allUsers = await userService.getAllUsers();

    // 2. Handle Weights (Setup the logic once)
    let weights = null;
    if (interests && schedule && mbti) {
      weights = combinedScore.createCustomWeights(
        parseFloat(interests),
        parseFloat(schedule),
        parseFloat(mbti)
      );
    } else if (preference) {
      weights = combinedScore.getWeightsByPreference(preference);
    }

    // 3. Run matching ONCE (Super fast because data is local)
    const matches = combinedScore.findBestMatches(user, allUsers, weights);

    res.json({
      success: true,
      matches,
      weightsUsed: weights || 'balanced',
    });
  } catch (error) {
    console.error("Match Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
  /*
  if (!userProfile) {
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  
  let weights = preference ? combinedScore.getWeightsByPreference(preference) : null;
  const matches = combinedScore.findBestMatches(user, allUsers, weights);

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

  // Fetch Google Calendar availability for each user if available
  function convertEventsToAvailability(events) {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    return events.map((event) => {
      const startDate = new Date(event.start.dateTime || event.start.date);
      const endDate = new Date(event.end.dateTime || event.end.date);

      // FIX: Match the "Monday", "Tuesday" format expected by gcalAlgorithm
      const dayName = days[startDate.getDay()];

      return {
        date: startDate.toISOString().split('T')[0],
        day: dayName, // Now gcalAlgorithm.timeSlotsOverlap will work!
        startTime: `${String(startDate.getHours()).padStart(2, '0')}:${String(startDate.getMinutes()).padStart(2, '0')}`,
        endTime: `${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}`,
      };
    })
  }

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
*/
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
