import { useState } from 'react';
import '../styles/activitycalendar.css';

function ActivityCalendar({ data }) {
  const { activityCalendar } = data;
  const [selectedDate, setSelectedDate] = useState(null);

  // Get last 365 days of activity
  const getCalendarData = () => {
    const dates = Object.keys(activityCalendar).sort();
    const last365Days = dates.slice(-365);
    
    return last365Days.map(date => ({
      date,
      count: activityCalendar[date]
    }));
  };

  const calendarData = getCalendarData();
  
  // Get max count for color scaling
  const maxCount = Math.max(...Object.values(activityCalendar));

  // Get intensity level (0-4) based on submission count
  const getIntensity = (count) => {
    if (count === 0) return 0;
    if (count <= maxCount * 0.25) return 1;
    if (count <= maxCount * 0.5) return 2;
    if (count <= maxCount * 0.75) return 3;
    return 4;
  };

  // Group by month for display
  const getMonthlyData = () => {
    const months = {};
    calendarData.forEach(({ date, count }) => {
      const [year, month] = date.split('-');
      const key = `${year}-${month}`;
      if (!months[key]) months[key] = [];
      months[key].push({ date, count });
    });
    return months;
  };

  const monthlyData = getMonthlyData();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <div className="activity-calendar-section">
      <div className="card">
        <h2>📅 Activity Calendar</h2>
        <p className="section-subtitle">Your coding activity across all platforms (Last 365 days)</p>

        {/* Stats Summary */}
        <div className="calendar-stats">
          <div className="calendar-stat">
            <span className="stat-label">Total Active Days</span>
            <span className="stat-value">{Object.keys(activityCalendar).length}</span>
          </div>
          <div className="calendar-stat">
            <span className="stat-label">Total Submissions</span>
            <span className="stat-value">{Object.values(activityCalendar).reduce((a, b) => a + b, 0)}</span>
          </div>
          <div className="calendar-stat">
            <span className="stat-label">Max Daily Submissions</span>
            <span className="stat-value">{maxCount}</span>
          </div>
          <div className="calendar-stat">
            <span className="stat-label">Avg Daily (Active Days)</span>
            <span className="stat-value">
              {(Object.values(activityCalendar).reduce((a, b) => a + b, 0) / Object.keys(activityCalendar).length).toFixed(1)}
            </span>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="calendar-container">
          <div className="calendar-grid">
            {calendarData.map(({ date, count }) => (
              <div
                key={date}
                className={`calendar-cell intensity-${getIntensity(count)}`}
                data-date={date}
                data-count={count}
                onMouseEnter={() => setSelectedDate({ date, count })}
                onMouseLeave={() => setSelectedDate(null)}
                title={`${date}: ${count} submissions`}
              />
            ))}
          </div>

          {/* Legend */}
          <div className="calendar-legend">
            <span className="legend-label">Less</span>
            <div className="legend-scale">
              {[0, 1, 2, 3, 4].map(level => (
                <div key={level} className={`legend-cell intensity-${level}`} />
              ))}
            </div>
            <span className="legend-label">More</span>
          </div>
        </div>

        {/* Tooltip */}
        {selectedDate && (
          <div className="calendar-tooltip">
            <strong>{selectedDate.date}</strong>: {selectedDate.count} submission{selectedDate.count !== 1 ? 's' : ''}
          </div>
        )}

        {/* Recent Activity Highlights */}
        <div className="recent-activity">
          <h3>🔥 Recent Activity</h3>
          <div className="recent-days">
            {calendarData.slice(-7).reverse().map(({ date, count }) => (
              <div key={date} className="recent-day-item">
                <span className="day-date">{new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                <div className="day-bar">
                  <div 
                    className="day-bar-fill" 
                    style={{ 
                      width: `${(count / maxCount) * 100}%`,
                      backgroundColor: count > 0 ? '#22c55e' : '#333'
                    }}
                  />
                </div>
                <span className="day-count">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ActivityCalendar;
