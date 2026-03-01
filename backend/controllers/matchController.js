import * as combinedScore from '../algorithms/combinedScore.js';

// Get matches for a user with custom weights
export async function getMatches(req, res) {
  try {
    const { userId } = req.params;

    // Get optional weight parameters from query string
    // Example: /api/matches/123?interests=50&schedule=30&mbti=20
    const { interests, schedule, mbti, preference } = req.query;

    // Mock user data - replace with actual database query
    const user = {
      id: userId,
      interests: ['coding', 'music'],
      availability: [
        { day: 'Monday', startTime: '14:00', endTime: '17:00' },
        { day: 'Wednesday', startTime: '10:00', endTime: '12:00' },
      ],
      mbti: 'INFJ',
    };

    const allUsers = [
      {
        id: '2',
        name: 'Alex',
        interests: ['coding', 'gaming'],
        availability: [
          { day: 'Monday', startTime: '15:00', endTime: '18:00' },
        ],
        mbti: 'ENFP',
      },
      {
        id: '3',
        name: 'Sam',
        interests: ['music', 'art'],
        availability: [
          { day: 'Wednesday', startTime: '09:00', endTime: '11:00' },
        ],
        mbti: 'INTJ',
      },
    ];

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
