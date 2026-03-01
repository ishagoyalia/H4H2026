/**
 * Match algorithm to find compatible users based on shared interests
 * This is the core matching logic for FriendZone
 */

/**
 * Find and rank potential friend matches for a user
 * @param {Object} user - The current user looking for matches
 * @param {Array} allUsers - Array of all users in the system
 * @returns {Array} - Sorted array of matches with scores
 */
export function findMatches(user, allUsers) {
  // Check if user has interests
  if (!user.interests || !Array.isArray(user.interests) || user.interests.length === 0) {
    console.warn('User has no interests set');
    return [];
  }

  // Step 1: Filter, Score, Sort
  const matches = allUsers
    // Remove the current user from potential matches
    .filter(otherUser => otherUser.id !== user.id)

    // Only include users who have interests
    .filter(otherUser => otherUser.interests && Array.isArray(otherUser.interests) && otherUser.interests.length > 0)

    // Calculate match score for each potential friend
    .map(otherUser => {
      // Find interests that both users have in common
      const commonInterests = user.interests.filter(interest =>
        otherUser.interests.includes(interest)
      );

      // Calculate match percentage: (common interests / total user interests) * 100
      // Example: If user has 5 interests and 3 are common = 60% match
      const score = (commonInterests.length / user.interests.length) * 100;

      // Return user data with match score and common interests
      return {
        ...otherUser,                      // Keep all original user data
        matchScore: Math.round(score),     // Add rounded match percentage
        commonInterests,                   // Add array of shared interests
      };
    })

    // Step 2: Filter out users with no common interests (0% match)
    .filter(match => match.matchScore > 0)

    // Step 3: Sort by match score (highest first)
    .sort((a, b) => b.matchScore - a.matchScore);

  return matches;
};

/**
 * Calculate compatibility score between two specific users
 * @param {Object} user1 - First user
 * @param {Object} user2 - Second user
 * @returns {Object} - Compatibility score and number of common interests
 */
export function calculateCompatibility(user1, user2) {
  // Count how many interests overlap between the two users
  const interestMatch = user1.interests.filter(interest =>
    user2.interests.includes(interest)
  ).length;

  // Return detailed compatibility info
  return {
    score: (interestMatch / user1.interests.length) * 100,  // Percentage match
    commonInterests: interestMatch,                          // Number of shared interests
  };
};
