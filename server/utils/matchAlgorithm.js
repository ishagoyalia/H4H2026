// Match algorithm to find compatible users

exports.findMatches = (user, allUsers) => {
  // Calculate match scores based on common interests
  const matches = allUsers
    .filter(otherUser => otherUser.id !== user.id)
    .map(otherUser => {
      const commonInterests = user.interests.filter(interest =>
        otherUser.interests.includes(interest)
      );
      
      const score = (commonInterests.length / user.interests.length) * 100;
      
      return {
        ...otherUser,
        matchScore: Math.round(score),
        commonInterests,
      };
    })
    .filter(match => match.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore);
  
  return matches;
};

exports.calculateCompatibility = (user1, user2) => {
  // More sophisticated compatibility calculation
  const interestMatch = user1.interests.filter(interest =>
    user2.interests.includes(interest)
  ).length;
  
  return {
    score: (interestMatch / user1.interests.length) * 100,
    commonInterests: interestMatch,
  };
};
