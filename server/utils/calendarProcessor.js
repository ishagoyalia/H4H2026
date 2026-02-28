const googleCalendar = require('./googleCalendar');
const tokenStore = require('./tokenStore');

/**
 * Convert Google Calendar events to availability format
 * Returns busy and free slots for the next 2 weeks
 * @param {Array} events - Google Calendar events
 * @returns {Object} - Availability with busy/free time slots
 */
function convertEventsToAvailability(events) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const twoWeeksLater = new Date(today);
  twoWeeksLater.setDate(today.getDate() + 14);

  const availability = [];
  const dayMap = {}; // Track busy times per day

  // Initialize all days as free
  for (let d = new Date(today); d <= twoWeeksLater; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    dayMap[dateStr] = { date: dateStr, freeSlots: [{ start: '00:00', end: '23:59' }] };
  }

  // Mark busy times from events
  events.forEach(event => {
    if (!event.start || !event.end) return;

    const startDate = new Date(event.start.dateTime || event.start.date);
    const endDate = new Date(event.end.dateTime || event.end.date);
    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];

    if (!dayMap[startDateStr]) return;

    const startTime = event.start.dateTime
      ? startDate.toTimeString().slice(0, 5)
      : '00:00';
    const endTime = event.end.dateTime
      ? endDate.toTimeString().slice(0, 5)
      : '23:59';

    // Subtract busy time from free slots
    dayMap[startDateStr].freeSlots = subtractBusyTime(
      dayMap[startDateStr].freeSlots,
      startTime,
      endTime
    );
  });

  // Convert to availability array format [[date], [times]]
  Object.keys(dayMap)
    .sort()
    .forEach(dateStr => {
      const day = dayMap[dateStr];
      if (day.freeSlots.length > 0) {
        day.freeSlots.forEach(slot => {
          availability.push({
            date: dateStr,
            startTime: slot.start,
            endTime: slot.end,
            duration: calculateDuration(slot.start, slot.end),
          });
        });
      }
    });

  return availability;
}

/**
 * Subtract busy time from free time slots
 */
function subtractBusyTime(freeSlots, busyStart, busyEnd) {
  const result = [];
  const busyStartMin = timeToMinutes(busyStart);
  const busyEndMin = timeToMinutes(busyEnd);

  freeSlots.forEach(slot => {
    const slotStartMin = timeToMinutes(slot.start);
    const slotEndMin = timeToMinutes(slot.end);

    // No overlap
    if (busyEndMin <= slotStartMin || busyStartMin >= slotEndMin) {
      result.push(slot);
      return;
    }

    // Add free time before busy period
    if (slotStartMin < busyStartMin) {
      result.push({
        start: slot.start,
        end: minutesToTime(busyStartMin),
      });
    }

    // Add free time after busy period
    if (slotEndMin > busyEndMin) {
      result.push({
        start: minutesToTime(busyEndMin),
        end: slot.end,
      });
    }
  });

  return result;
}

function timeToMinutes(time) {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function minutesToTime(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function calculateDuration(startTime, endTime) {
  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);
  return (end - start) / 60; // hours
}

/**
 * Get availability for a user from their saved calendar tokens
 * @param {String} userId - User ID
 * @returns {Array} - Availability slots
 */
async function getUserAvailability(userId) {
  const tokens = tokenStore.getTokens(userId);
  if (!tokens) return null;

  const now = new Date().toISOString();
  const twoWeeksLater = new Date();
  twoWeeksLater.setDate(twoWeeksLater.getDate() + 14);
  const timeMax = twoWeeksLater.toISOString();

  try {
    const events = await googleCalendar.listEvents(tokens, {
      timeMin: now,
      timeMax,
      maxResults: 250,
    });

    return convertEventsToAvailability(events);
  } catch (err) {
    console.error(`Error fetching availability for ${userId}:`, err.message);
    return null;
  }
}

module.exports = {
  convertEventsToAvailability,
  getUserAvailability,
};
