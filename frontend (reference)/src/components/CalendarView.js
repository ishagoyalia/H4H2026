import React from 'react';

function CalendarView({ events }) {
  return (
    <div className="calendar-view">
      <h3>Calendar</h3>
      <div className="calendar-grid">
        {events?.map((event, index) => (
          <div key={index} className="calendar-event">
            <span className="event-date">{event.date}</span>
            <span className="event-title">{event.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CalendarView;
