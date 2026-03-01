import * as combinedScore from '../algorithms/combinedScore.js';
import * as userService from '../userService.js';
import * as scheduleMatchService from '../services/scheduleMatchService.js';
import * as gcalAlgorithm from '../algorithms/gcalAlgorithm.js';

export async function getMatches(req, res) {
  try {
    const { userId } = req.params;
    const { interests, schedule, mbti, preference } = req.query;

    // 1. Fetch current user and all other users
    const userProfile = await userService.getUserProfile(userId);
    if (!userProfile) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    const allUsers = await userService.getAllUsers();

    // 2. FETCH AVAILABILITY IN PARALLEL
    // This is the fix for the "Failed to Fetch" timeout issue
    const usersWithAvailability = await Promise.all(allUsers.map(async (otherUser) => {
      try {
        // Only fetch if they have a calendar connected
        if (otherUser.calendarConnected) {
          console.log(`📅 Fetching calendar for user ${otherUser.id}`);
          const calendarData = await scheduleMatchService.getUserAvailability(otherUser.id);

          console.log(`📅 User ${otherUser.id}: Found ${calendarData.availability?.length || 0} busy blocks`);
          if (calendarData.availability && calendarData.availability.length > 0) {
            console.log(`📅 Sample busy block:`, calendarData.availability[0]);
          }

          // INVERSION: Convert busy events to free slots before matching
          const freeSlots = gcalAlgorithm.calculateFreeSlots(calendarData.availability);
          console.log(`✨ User ${otherUser.id}: Calculated ${freeSlots.length} free slots`);
          if (freeSlots.length > 0) {
            console.log(`✨ Sample free slot:`, freeSlots[0]);
          }

          return {
            ...otherUser,
            availability: freeSlots
          };
        }
      } catch (err) {
        console.error(`❌ Calendar fetch failed for ${otherUser.id}:`, err.message);
      }
      // Fallback to manual availability if Google fails or isn't connected
      return { ...otherUser, availability: otherUser.availability || [] };
    }));

    const currentUser = usersWithAvailability.find(u => u.id === userId);

    // 3. Handle Weights
    let weights = null;
    if (interests && schedule && mbti) {
      weights = combinedScore.createCustomWeights(
        parseFloat(interests), parseFloat(schedule), parseFloat(mbti)
      );
    } else if (preference) {
      weights = combinedScore.getWeightsByPreference(preference);
    }

    // 4. Run matching
    const matches = combinedScore.findBestMatches(currentUser, usersWithAvailability, weights);

    res.json({
      success: true,
      matches,
      weightsUsed: weights || 'balanced',
    });
  } catch (error) {
    console.error("Match Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
}