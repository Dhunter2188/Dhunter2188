import { useState, useEffect } from 'react';
import { fetchHistory } from '../api.js';

export default function HistoryView() {
  const [days, setDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHistory()
      .then((data) => setDays(data.days))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="card history-view"><p className="empty-state">Loading history…</p></div>;
  if (error) return <div className="card history-view"><p className="empty-state" style={{ color: 'var(--danger)' }}>{error}</p></div>;

  if (days.length === 0) {
    return (
      <div className="card history-view">
        <p className="empty-state">No history yet. Start logging meals!</p>
      </div>
    );
  }

  return (
    <div className="card history-view">
      <h2>History</h2>
      <table className="history-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Total</th>
            <th>Goal</th>
          </tr>
        </thead>
        <tbody>
          {days.map((day) => (
            <tr key={day.date}>
              <td>{formatDate(day.date)}</td>
              <td>{day.total.toFixed(1)}g</td>
              <td>
                {day.hitTarget
                  ? <span className="badge-hit">Hit</span>
                  : <span className="badge-miss">Missed</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
  });
}
