/**
 * Combined scoring algorithm
 * Merges multiple matching algorithms (interests, schedule, MBTI) into a final score
 * 
 * USAGE WITH USER INPUT:
 * 
 * Method 1: Custom weights from user sliders (0-100)
 *   const weights = createCustomWeights(50, 30, 20); // 50% interests, 30% schedule, 20% MBTI
 *   const matches = findBestMatches(user, allUsers, weights);
 * 
 * Method 2: Direct percentage input
 *   const matches = findBestMatches(user, allUsers, { interests: 60, schedule: 25, mbti: 15 });
 * 
 * Method 3: Use preset preferences
 *   const weights = getWeightsByPreference('interests'); // 60% interests, 20% schedule, 20% MBTI
 *   const matches = findBestMatches(user, allUsers, weights);
 * 
 * Method 4: Default balanced weights
 *   const matches = findBestMatches(user, allUsers); // 40% interests, 30% schedule, 30% MBTI
 */

import * as matchAlgorithm from './interestsAlgorithm.js';
import * as scheduleAlgorithm from './gcalAlgorithm.js';
import * as mbtiAlgorithm from './mbtiAlgorithm.js';

/**
 * Find best overall matches combining all factors
 * @param {Object} user - The current user
 * @param {Array} allUsers - All users in the system
 * @param {Object} userWeights - Optional user-defined weights for each factor
 *                               Can be percentages (0-100) or decimals (0-1)
 *                               Example: { interests: 50, schedule: 30, mbti: 20 }
 * @returns {Array} - Ranked matches with combined scores
 */
export function findBestMatches(user, allUsers, userWeights = null) {
  // Default weights (must add up to 1.0)
  const defaultWeights = {
    interests: 0.4,    // 40% weight on shared interests
    schedule: 0.3,     // 30% weight on schedule overlap
    mbti: 0.3,         // 30% weight on personality compatibility
  };

  // Process and normalize user weights if provided
  const finalWeights = userWeights
    ? normalizeWeights(userWeights)
    : defaultWeights;

  // Step 1: Get interest-based matches
  const interestMatches = matchAlgorithm.findMatches(user, allUsers);

  // Step 2: Get schedule-based matches
  const scheduleMatches = scheduleAlgorithm.findScheduleMatches(user, allUsers);

  // Step 3: Get MBTI-based matches
  const mbtiMatches = mbtiAlgorithm.findMBTIMatches(user, allUsers);

  // Step 4: Create lookup maps for quick access
  const interestMap = createScoreMap(interestMatches, 'matchScore');
  const scheduleMap = createScoreMap(scheduleMatches, 'scheduleScore');
  const mbtiMap = createScoreMap(mbtiMatches, 'mbtiScore');

  // Step 5: Combine scores for all users
  const combinedMatches = allUsers
    .filter(otherUser => otherUser.id !== user.id)
    .map(otherUser => {
      // Get individual scores (default to 0 if not found)
      const interestScore = interestMap.get(otherUser.id) || 0;
      const scheduleScore = scheduleMap.get(otherUser.id) || 0;
      const mbtiScore = mbtiMap.get(otherUser.id) || 0;

      // Calculate weighted combined score
      const combinedScore =
        (interestScore * finalWeights.interests) +
        (scheduleScore * finalWeights.schedule) +
        (mbtiScore * finalWeights.mbti);

      // Get detailed match data
      const interestData = interestMatches.find(m => m.id === otherUser.id) || {};
      const scheduleData = scheduleMatches.find(m => m.id === otherUser.id) || {};
      const mbtiData = mbtiMatches.find(m => m.id === otherUser.id) || {};

      return {
        ...otherUser,
        // Final combined score
        finalScore: Math.round(combinedScore),

        // Individual component scores
        scores: {
          interest: Math.round(interestScore),
          schedule: Math.round(scheduleScore),
          mbti: Math.round(mbtiScore),
        },

        // Detailed match information
        matchDetails: {
          commonInterests: interestData.commonInterests || [],
          overlappingSlots: scheduleData.overlappingSlots || [],
          totalOverlapHours: scheduleData.totalOverlapHours || 0,
          mbtiCompatibility: mbtiData.compatibilityType || null,
          mbtiDetails: mbtiData.mbtiDetails || null,
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
 * Normalize and validate user-provided weights
 * Handles both percentage (0-100) and decimal (0-1) inputs
 * @param {Object} userWeights - User-provided weights
 * @returns {Object} - Normalized weights that sum to 1.0
 */
function normalizeWeights(userWeights) {
  // Default weights in case user doesn't provide all factors
  const defaultWeights = {
    interests: 0.4,
    schedule: 0.3,
    mbti: 0.3,
  };

  // Merge user weights with defaults
  const weights = {
    interests: userWeights.interests !== undefined ? userWeights.interests : defaultWeights.interests,
    schedule: userWeights.schedule !== undefined ? userWeights.schedule : defaultWeights.schedule,
    mbti: userWeights.mbti !== undefined ? userWeights.mbti : defaultWeights.mbti,
  };

  // Calculate total to determine if percentages or decimals
  const total = weights.interests + weights.schedule + weights.mbti;

  // If total is greater than 10, assume percentages (convert to decimals)
  if (total > 10) {
    return {
      interests: weights.interests / 100,
      schedule: weights.schedule / 100,
      mbti: weights.mbti / 100,
    };
  }

  // If total is close to 1.0, return as is (already normalized)
  if (Math.abs(total - 1.0) < 0.01) {
    return weights;
  }

  // Otherwise, normalize to sum to 1.0
  return {
    interests: weights.interests / total,
    schedule: weights.schedule / total,
    mbti: weights.mbti / total,
  };
}

/**
 * Calculate combined compatibility between two specific users
 * @param {Object} user1 - First user
 * @param {Object} user2 - Second user
 * @param {Object} userWeights - Optional user-defined weights (percentages or decimals)
 * @returns {Object} - Combined compatibility score and breakdown
 */
export function calculateCombinedCompatibility(user1, user2, userWeights = null) {
  const defaultWeights = {
    interests: 0.4,
    schedule: 0.3,
    mbti: 0.3,
  };

  // Process and normalize user weights if provided
  const finalWeights = userWeights
    ? normalizeWeights(userWeights)
    : defaultWeights;

  // Get individual compatibility scores
  const interestCompat = matchAlgorithm.calculateCompatibility(user1, user2);
  const scheduleCompat = scheduleAlgorithm.calculateScheduleCompatibility(user1, user2);
  const mbtiCompat = mbtiAlgorithm.calculateMBTICompatibility(user1, user2);

  // Calculate weighted combined score
  const combinedScore =
    (interestCompat.score * finalWeights.interests) +
    (scheduleCompat.score * finalWeights.schedule) +
    (mbtiCompat.score * finalWeights.mbti);

  return {
    finalScore: Math.round(combinedScore),
    breakdown: {
      interestScore: Math.round(interestCompat.score),
      scheduleScore: Math.round(scheduleCompat.score),
      mbtiScore: Math.round(mbtiCompat.score || 0),
      commonInterests: interestCompat.commonInterests,
      overlappingHours: scheduleCompat.totalOverlapHours,
      mbtiCompatibility: mbtiCompat.type || null,
    },
    weights: finalWeights,
  };
};

/**
 * Adjust matching weights dynamically based on user preferences
 * @param {String} userPreference - User's priority ("interests", "schedule", "mbti", "balanced")
 * @returns {Object} - Weight configuration
 */
export function getWeightsByPreference(userPreference) {
  const presets = {
    interests: { interests: 0.6, schedule: 0.2, mbti: 0.2 },   // Prioritize shared interests
    schedule: { interests: 0.2, schedule: 0.6, mbti: 0.2 },    // Prioritize availability
    mbti: { interests: 0.2, schedule: 0.2, mbti: 0.6 },        // Prioritize personality
    balanced: { interests: 0.33, schedule: 0.33, mbti: 0.34 }, // Equal weight
  };

  return presets[userPreference] || presets.balanced;
};

/**
 * Create custom weights from user slider input
 * Useful for frontend where users adjust sliders from 0-100
 * @param {Number} interestsPercent - Interest weight (0-100)
 * @param {Number} schedulePercent - Schedule weight (0-100)
 * @param {Number} mbtiPercent - MBTI weight (0-100)
 * @returns {Object} - Normalized weight configuration
 * @example
 * // User sets sliders: 50% interests, 30% schedule, 20% MBTI
 * const weights = createCustomWeights(50, 30, 20);
 * const matches = findBestMatches(user, allUsers, weights);
 */
export function createCustomWeights(interestsPercent, schedulePercent, mbtiPercent) {
  return normalizeWeights({
    interests: interestsPercent,
    schedule: schedulePercent,
    mbti: mbtiPercent,
  });
};
