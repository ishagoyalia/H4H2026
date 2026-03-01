/**
 * Schedule/Availability matching algorithm
 * Matches users based on overlapping free time and calendar availability
 */

/**
 * Find users with overlapping free time
 * @param {Object} user - The current user with their schedule
 * @param {Array} allUsers - Array of all users in the system
 * @returns {Array} - Users with schedule overlap scores
 */
export function findScheduleMatches(user, allUsers) {
  // Calculate schedule compatibility for each user
  const scheduleMatches = allUsers
    // Remove the current user
    .filter(otherUser => otherUser.id !== user.id)

    // Calculate time overlap for each potential match
    .map(otherUser => {
      // Find overlapping free time slots
      const overlappingSlots = findOverlappingTimeSlots(
        user.availability || [],
        otherUser.availability || []
      );

      // Calculate match score based on number of overlapping hours
      const totalOverlapHours = overlappingSlots.reduce(
        (sum, slot) => sum + slot.duration,
        0
      );

      // Score: More overlapping hours = higher score (max 100)
      // Assuming 20+ hours overlap = perfect match
      const scheduleScore = Math.min((totalOverlapHours / 20) * 100, 100);

      return {
        ...otherUser,
        scheduleScore: Math.round(scheduleScore),
        overlappingSlots,              // Array of matching time slots
        totalOverlapHours,              // Total hours available together
      };
    })

    // Filter out users with no overlapping time (0% match)
    .filter(match => match.scheduleScore > 0)

    // Sort by schedule compatibility (most overlap first)
    .sort((a, b) => b.scheduleScore - a.scheduleScore);

  return scheduleMatches;
};

/**
 * Find time slots that overlap between two users
 * @param {Array} userAvailability - First user's availability slots
 * @param {Array} otherAvailability - Second user's availability slots
 * @returns {Array} - Array of overlapping time slots
 */
function findOverlappingTimeSlots(userAvailability, otherAvailability) {
  const overlaps = [];

  // Compare each of user's availability slots with other user's slots
  userAvailability.forEach(userSlot => {
    otherAvailability.forEach(otherSlot => {
      // Check if time slots overlap
      if (timeSlotsOverlap(userSlot, otherSlot)) {
        // Calculate the overlapping period
        const overlap = calculateOverlap(userSlot, otherSlot);
        overlaps.push(overlap);
      }
    });
  });

  return overlaps;
}

/**
 * Check if two time slots overlap
 * @param {Object} slot1 - First time slot {day, startTime, endTime}
 * @param {Object} slot2 - Second time slot {day, startTime, endTime}
 * @returns {Boolean} - True if slots overlap
 */
function timeSlotsOverlap(slot1, slot2) {
  // Must be the same day
  if (slot1.day !== slot2.day) return false;

  // Convert times to minutes for easier comparison
  const start1 = timeToMinutes(slot1.startTime);
  const end1 = timeToMinutes(slot1.endTime);
  const start2 = timeToMinutes(slot2.startTime);
  const end2 = timeToMinutes(slot2.endTime);

  // Check if time ranges overlap
  return start1 < end2 && start2 < end1;
}

/**
 * Calculate the overlapping time period between two slots
 * @param {Object} slot1 - First time slot
 * @param {Object} slot2 - Second time slot
 * @returns {Object} - Overlapping time slot with duration
 */
function calculateOverlap(slot1, slot2) {
  const start1 = timeToMinutes(slot1.startTime);
  const end1 = timeToMinutes(slot1.endTime);
  const start2 = timeToMinutes(slot2.startTime);
  const end2 = timeToMinutes(slot2.endTime);

  // Find the overlapping period
  const overlapStart = Math.max(start1, start2);
  const overlapEnd = Math.min(end1, end2);
  const durationMinutes = overlapEnd - overlapStart;

  return {
    day: slot1.day,
    startTime: minutesToTime(overlapStart),
    endTime: minutesToTime(overlapEnd),
    duration: durationMinutes / 60,  // Convert to hours
  };
}

/**
 * Convert time string to minutes since midnight
 * @param {String} time - Time in format "HH:MM" (e.g., "14:30")
 * @returns {Number} - Minutes since midnight
 */
function timeToMinutes(time) {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Convert minutes since midnight to time string
 * @param {Number} minutes - Minutes since midnight
 * @returns {String} - Time in format "HH:MM"
 */
function minutesToTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

/**
 * Calculate schedule compatibility between two specific users
 * @param {Object} user1 - First user
 * @param {Object} user2 - Second user
 * @returns {Object} - Schedule compatibility score and details
 */
export function calculateScheduleCompatibility(user1, user2) {
  const overlappingSlots = findOverlappingTimeSlots(
    user1.availability || [],
    user2.availability || []
  );

  const totalOverlapHours = overlappingSlots.reduce(
    (sum, slot) => sum + slot.duration,
    0
  );

  return {
    score: Math.min((totalOverlapHours / 20) * 100, 100),
    overlappingSlots,
    totalOverlapHours,
  };
};
