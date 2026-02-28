const matchAlgorithm = require('../utils/matchAlgorithm');

// Get matches for a user
exports.getMatches = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Mock user data - replace with actual database query
    const user = { id: userId, interests: ['coding', 'music'] };
    const allUsers = [
      { id: '2', name: 'Alex', interests: ['coding', 'gaming'] },
      { id: '3', name: 'Sam', interests: ['music', 'art'] },
    ];
    
    const matches = matchAlgorithm.findMatches(user, allUsers);
    res.json({ success: true, matches });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Create a new match
exports.createMatch = async (req, res) => {
  try {
    const { userId1, userId2 } = req.body;
    
    // Logic to create a match connection
    const match = { userId1, userId2, createdAt: new Date() };
    
    res.json({ success: true, match });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
