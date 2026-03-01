/** @4:22pm
 * Schedule Match Service
 * Orchestrates fetching Google Calendar events and calculating schedule compatibility
 */

const googleCalendar = require('../algorithms/googleCalendar');
const gcalAlgorithm = require('../algorithms/gcalAlgorithm');
const tokenStore = require('../algorithms/tokenStore');

/**
 * Convert Google Calendar events to availability slots compatible with algorithm
 * @param {Array} events - Google Calendar events
 * @returns {Array} - Availability slots with day, startTime, endTime
 */
function convertEventsToAvailability(events) {
    return events.map((event) => {
        const startDate = new Date(event.start.dateTime || event.start.date);
        const endDate = new Date(event.end.dateTime || event.end.date);

        // Use ISO date string as "day" so algorithm can match exact dates
        const isoDate = startDate.toISOString().split('T')[0];

        // Format time as HH:MM
        const startTime = `${String(startDate.getHours()).padStart(2, '0')}:${String(startDate.getMinutes()).padStart(2, '0')}`;
        const endTime = `${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}`;

        return {
            date: isoDate, // YYYY-MM-DD
            day: isoDate, // Algorithm uses "day" field - we use actual date here
            startTime,
            endTime,
            title: event.summary || 'Busy',
        };
    });
}

/**
 * Get calendar events for a user for the next 2 weeks
 * @param {String} userId - User ID
 * @returns {Object} - { userId, availability, rawEvents }
 */
async function getUserAvailability(userId) {
    const tokens = tokenStore.getTokens(userId);
    if (!tokens) throw new Error(`No tokens stored for user ${userId}. Please authorize first.`);

    const now = new Date();
    const twoWeeksLater = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

    const timeMin = now.toISOString();
    const timeMax = twoWeeksLater.toISOString();

    // Fetch events from Google Calendar
    const events = await googleCalendar.listEvents(tokens, {
        timeMin,
        timeMax,
        maxResults: 100,
    });

    // Convert events to availability slots (format expected by algorithm)
    const availability = convertEventsToAvailability(events);

    return {
        userId,
        availability,
        rawEvents: events,
        timeRange: { from: timeMin, to: timeMax },
    };
}

/**
 * Compare two users' schedules and calculate match score
 * @param {String} userId1 - First user ID
 * @param {String} userId2 - Second user ID
 * @returns {Object} - Match data with score and overlapping times
 */
async function compareSchedules(userId1, userId2) {
    try {
        // Fetch both users' availability
        const user1Data = await getUserAvailability(userId1);
        const user2Data = await getUserAvailability(userId2);

        // Prepare user objects for algorithm
        const user1 = {
            id: userId1,
            availability: user1Data.availability,
        };

        const user2 = {
            id: userId2,
            availability: user2Data.availability,
        };

        // Calculate schedule compatibility using algorithm
        const compatibility = gcalAlgorithm.calculateScheduleCompatibility(user1, user2);

        // Format overlapping time slots as [[date], [time_range]]
        const overlappingTimes = compatibility.overlappingSlots.map((slot) => [
            [slot.day], // Date as array (e.g., ["2026-03-01"])
            [`${slot.startTime} - ${slot.endTime}`], // Time range as array
        ]);

        return {
            success: true,
            userId1,
            userId2,
            matchScore: Math.round(compatibility.score),
            matchScorePercentage: `${Math.round(compatibility.score)}%`,
            totalOverlapHours: Math.round(compatibility.totalOverlapHours * 10) / 10,
            overlappingTimes,
            user1AvailabilityCount: user1Data.availability.length,
            user2AvailabilityCount: user2Data.availability.length,
        };
    } catch (error) {
        throw new Error(`Schedule comparison failed: ${error.message}`);
    }
}

/**
 * Get all schedule matches for a user compared against multiple other users
 * @param {String} userId - User ID
 * @param {Array} otherUserIds - Array of other user IDs to compare
 * @returns {Object} - Matches sorted by score
 */
async function findScheduleMatches(userId, otherUserIds) {
    try {
        const userAvailability = await getUserAvailability(userId);
        const user = {
            id: userId,
            ...userAvailability,
        };

        // Compare with each other user
        const matches = [];
        for (const otherId of otherUserIds) {
            try {
                const result = await compareSchedules(userId, otherId);
                if (result.matchScore > 0) {
                    matches.push(result);
                }
            } catch (err) {
                // Skip users with no tokens or auth errors
                console.error(`Could not compare ${userId} with ${otherId}:`, err.message);
            }
        }

        // Sort by match score (highest first)
        matches.sort((a, b) => b.matchScore - a.matchScore);

        return {
            success: true,
            userId,
            totalMatches: matches.length,
            matches,
        };
    } catch (error) {
        throw new Error(`Finding schedule matches failed: ${error.message}`);
    }
}

module.exports = {
    getUserAvailability,
    compareSchedules,
    findScheduleMatches,
    convertEventsToAvailability,
};
