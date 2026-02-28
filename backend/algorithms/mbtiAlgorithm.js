/**
 * MBTI (Myers-Briggs Type Indicator) matching algorithm
 * Matches users based on personality type compatibility
 */

// Perfect MBTI pairs (100% compatible)
const PERFECT_PAIRS = [
  ['INFJ', 'ENFP'],
  ['INTJ', 'ENTP'],
  ['INFP', 'ENFJ'],
  ['INTP', 'INFJ'],
  ['ISTJ', 'ISFJ'],
  ['ESTP', 'ESFP'],
  ['ISFJ', 'ESFJ'],
];

/**
 * Find MBTI-compatible matches for a user
 * @param {Object} user - The current user with MBTI type
 * @param {Array} allUsers - Array of all users in the system
 * @returns {Array} - Users ranked by MBTI compatibility
 */
exports.findMBTIMatches = (user, allUsers) => {
  // Check if user has MBTI type set
  if (!user.mbti) {
    console.warn('User does not have MBTI type set');
    return [];
  }

  const mbtiMatches = allUsers
    // Remove the current user
    .filter(otherUser => otherUser.id !== user.id)
    
    // Filter users who have MBTI type set
    .filter(otherUser => otherUser.mbti)
    
    // Calculate MBTI compatibility for each user
    .map(otherUser => {
      const compatibilityResult = calculateMBTICompatibility(
        user.mbti,
        otherUser.mbti
      );
      
      return {
        ...otherUser,
        mbtiScore: compatibilityResult.score,
        compatibilityType: compatibilityResult.type,  // 'perfect' or 'calculated'
        mbtiDetails: compatibilityResult.details,
      };
    })
    
    // Sort by MBTI compatibility (highest first)
    .sort((a, b) => b.mbtiScore - a.mbtiScore);
  
  return mbtiMatches;
};

/**
 * Calculate MBTI compatibility between two personality types
 * @param {String} mbti1 - First user's MBTI type (e.g., "INFJ")
 * @param {String} mbti2 - Second user's MBTI type (e.g., "ENFP")
 * @returns {Object} - Compatibility score and details
 */
function calculateMBTICompatibility(mbti1, mbti2) {
  // Step 1: Check if this is a perfect pair
  const isPerfectPair = checkPerfectPair(mbti1, mbti2);
  
  if (isPerfectPair) {
    return {
      score: 100,
      type: 'perfect',
      details: {
        reason: 'Perfect MBTI pair',
        conditionsMet: 4,
        totalConditions: 4,
      },
    };
  }
  
  // Step 2: Calculate compatibility based on letter position rules
  return calculateLetterCompatibility(mbti1, mbti2);
}

/**
 * Check if two MBTI types form a perfect pair
 * @param {String} mbti1 - First MBTI type
 * @param {String} mbti2 - Second MBTI type
 * @returns {Boolean} - True if perfect pair
 */
function checkPerfectPair(mbti1, mbti2) {
  // Check both directions (A-B and B-A)
  return PERFECT_PAIRS.some(([type1, type2]) => {
    return (mbti1 === type1 && mbti2 === type2) ||
           (mbti1 === type2 && mbti2 === type1);
  });
}

/**
 * Calculate compatibility based on letter position rules
 * Rules for 100% compatibility (if not a perfect pair):
 * - 1st letters are different
 * - 3rd letters are different
 * - 2nd letters are the same
 * - 4th letters are the same
 * 
 * Score: 25% per condition met (0%, 25%, 50%, 75%, 100%)
 * 
 * @param {String} mbti1 - First MBTI type
 * @param {String} mbti2 - Second MBTI type
 * @returns {Object} - Compatibility score and details
 */
function calculateLetterCompatibility(mbti1, mbti2) {
  let conditionsMet = 0;
  const conditions = [];
  
  // Condition 1: 1st letters are different (E/I)
  if (mbti1[0] !== mbti2[0]) {
    conditionsMet++;
    conditions.push('1st letter different (E/I)');
  }
  
  // Condition 2: 3rd letters are different (T/F)
  if (mbti1[2] !== mbti2[2]) {
    conditionsMet++;
    conditions.push('3rd letter different (T/F)');
  }
  
  // Condition 3: 2nd letters are the same (S/N)
  if (mbti1[1] === mbti2[1]) {
    conditionsMet++;
    conditions.push('2nd letter same (S/N)');
  }
  
  // Condition 4: 4th letters are the same (J/P)
  if (mbti1[3] === mbti2[3]) {
    conditionsMet++;
    conditions.push('4th letter same (J/P)');
  }
  
  // Calculate score: 25% per condition met
  const score = (conditionsMet / 4) * 100;
  
  return {
    score: Math.round(score),
    type: 'calculated',
    details: {
      conditionsMet,
      totalConditions: 4,
      matchingConditions: conditions,
      breakdown: {
        position1: mbti1[0] !== mbti2[0] ? 'Different ✓' : 'Same ✗',
        position2: mbti1[1] === mbti2[1] ? 'Same ✓' : 'Different ✗',
        position3: mbti1[2] !== mbti2[2] ? 'Different ✓' : 'Same ✗',
        position4: mbti1[3] === mbti2[3] ? 'Same ✓' : 'Different ✗',
      },
    },
  };
}

/**
 * Calculate MBTI compatibility between two specific users
 * @param {Object} user1 - First user
 * @param {Object} user2 - Second user
 * @returns {Object} - Compatibility score and details
 */
exports.calculateMBTICompatibility = (user1, user2) => {
  if (!user1.mbti || !user2.mbti) {
    return {
      score: 0,
      error: 'One or both users do not have MBTI type set',
    };
  }
  
  return calculateMBTICompatibility(user1.mbti, user2.mbti);
};

/**
 * Validate MBTI type format
 * @param {String} mbti - MBTI type to validate
 * @returns {Boolean} - True if valid MBTI type
 */
exports.isValidMBTI = (mbti) => {
  if (!mbti || typeof mbti !== 'string' || mbti.length !== 4) {
    return false;
  }
  
  const mbtiUpper = mbti.toUpperCase();
  
  // Check each position has valid letter
  const validFirstLetter = ['E', 'I'].includes(mbtiUpper[0]);
  const validSecondLetter = ['S', 'N'].includes(mbtiUpper[1]);
  const validThirdLetter = ['T', 'F'].includes(mbtiUpper[2]);
  const validFourthLetter = ['J', 'P'].includes(mbtiUpper[3]);
  
  return validFirstLetter && validSecondLetter && validThirdLetter && validFourthLetter;
};

/**
 * Get all perfect pair matches for a given MBTI type
 * @param {String} mbti - MBTI type
 * @returns {Array} - Array of perfect match MBTI types
 */
exports.getPerfectMatches = (mbti) => {
  const matches = [];
  
  PERFECT_PAIRS.forEach(([type1, type2]) => {
    if (type1 === mbti) {
      matches.push(type2);
    } else if (type2 === mbti) {
      matches.push(type1);
    }
  });
  
  return matches;
};
