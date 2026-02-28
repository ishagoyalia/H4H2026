/**
 * Combined scoring algorithm
 * Merges multiple matching algorithms (interests, schedule, etc.) into a final score
 */

const matchAlgorithm = require('./matchAlgorithm');
const scheduleAlgorithm = require('./scheduleAlgorithm');

/**
 * Find best overall matches combining all factors
 * @param {Object} user - The current user
 * @param {Array} allUsers - All users in the system
 * @param {Object} weights - Optional custom weights for each factor
 * @returns {Array} - Ranked matches with combined scores
 */
exports.findBestMatches = (user, allUsers, weights = null) => {
  // Default weights (must add up to 1.0)
  const defaultWeights = {
    interests: 0.6,    // 60% weight on shared interests
    schedule: 0.4,     // 40% weight on schedule overlap
  };
  
  // Use custom weights if provided, otherwise use defaults
  const finalWeights = weights || defaultWeights;
  
  // Step 1: Get interest-based matches
  const interestMatches = matchAlgorithm.findMatches(user, allUsers);
  
  // Step 2: Get schedule-based matches
  const scheduleMatches = scheduleAlgorithm.findScheduleMatches(user, allUsers);
  
  // Step 3: Create lookup maps for quick access
  const interestMap = createScoreMap(interestMatches, 'matchScore');
  const scheduleMap = createScoreMap(scheduleMatches, 'scheduleScore');
  
  // Step 4: Combine scores for all users
  const combinedMatches = allUsers
    .filter(otherUser => otherUser.id !== user.id)
    .map(otherUser => {
      // Get individual scores (default to 0 if not found)
      const interestScore = interestMap.get(otherUser.id) || 0;
      const scheduleScore = scheduleMap.get(otherUser.id) || 0;
      
      // Calculate weighted combined score
      const combinedScore = 
        (interestScore * finalWeights.interests) +
        (scheduleScore * finalWeights.schedule);
      
      // Get detailed match data
      const interestData = interestMatches.find(m => m.id === otherUser.id) || {};
      const scheduleData = scheduleMatches.find(m => m.id === otherUser.id) || {};
      
      return {
        ...otherUser,
        // Final combined score
        finalScore: Math.round(combinedScore),
        
        // Individual component scores
        scores: {
          interest: Math.round(interestScore),
          schedule: Math.round(scheduleScore),
        },
        
        // Detailed match information
        matchDetails: {
          commonInterests: interestData.commonInterests || [],
          overlappingSlots: scheduleData.overlappingSlots || [],
          totalOverlapHours: scheduleData.totalOverlapHours || 0,
        },
      };
    })
    
    // Filter out users with 0% combined score
    .filter(match => match.finalScore > 0)
    
    // Sort by final combined score (highest first)
    .sort((a, b) => b.finalScore - a.finalScore);
  
  return combinedMatches;
};

/**
 * Create a Map for quick score lookups
 * @param {Array} matches - Array of match objects
 * @param {String} scoreField - Field name containing the score
 * @returns {Map} - Map of userId -> score
 */
function createScoreMap(matches, scoreField) {
  const map = new Map();
  matches.forEach(match => {
    map.set(match.id, match[scoreField]);
  });
  return map;
}

/**
 * Calculate combined compatibility between two specific users
 * @param {Object} user1 - First user
 * @param {Object} user2 - Second user
 * @param {Object} weights - Optional custom weights
 * @returns {Object} - Combined compatibility score and breakdown
 */
exports.calculateCombinedCompatibility = (user1, user2, weights = null) => {
  const defaultWeights = {
    interests: 0.6,
    schedule: 0.4,
  };
  
  const finalWeights = weights || defaultWeights;
  
  // Get individual compatibility scores
  const interestCompat = matchAlgorithm.calculateCompatibility(user1, user2);
  const scheduleCompat = scheduleAlgorithm.calculateScheduleCompatibility(user1, user2);
  
  // Calculate weighted combined score
  const combinedScore = 
    (interestCompat.score * finalWeights.interests) +
    (scheduleCompat.score * finalWeights.schedule);
  
  return {
    finalScore: Math.round(combinedScore),
    breakdown: {
      interestScore: Math.round(interestCompat.score),
      scheduleScore: Math.round(scheduleCompat.score),
      commonInterests: interestCompat.commonInterests,
      overlappingHours: scheduleCompat.totalOverlapHours,
    },
    weights: finalWeights,
  };
};

/**
 * Adjust matching weights dynamically based on user preferences
 * @param {String} userPreference - User's priority ("interests", "schedule", "balanced")
 * @returns {Object} - Weight configuration
 */
exports.getWeightsByPreference = (userPreference) => {
  const presets = {
    interests: { interests: 0.8, schedule: 0.2 },   // Prioritize shared interests
    schedule: { interests: 0.3, schedule: 0.7 },    // Prioritize availability
    balanced: { interests: 0.5, schedule: 0.5 },    // Equal weight
  };
  
  return presets[userPreference] || presets.balanced;
};
