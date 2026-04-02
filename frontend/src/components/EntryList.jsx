export default function EntryList({ entries, onDelete, deletingRow }) {
  if (entries.length === 0) {
    return (
      <div className="card entry-list">
        <p className="empty-state">No entries yet today. Log your first meal above.</p>
      </div>
    );
  }

  return (
    <div className="card entry-list">
      <h2>Today's Entries</h2>
      <div className="entry-list-items">
        {entries.map((entry) => (
          <div key={entry.rowIndex} className="entry-item">
            <span className="entry-time">{formatTime(entry.time)}</span>
            <span className="entry-food">{entry.food}</span>
            <span className="entry-protein">{entry.protein}g</span>
            <button
              className="btn-danger"
              onClick={() => onDelete(entry.rowIndex)}
              disabled={deletingRow === entry.rowIndex}
              title="Delete entry"
            >
              {deletingRow === entry.rowIndex ? '…' : '✕'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function formatTime(timeStr) {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':');
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? 'pm' : 'am';
  const h12 = hour % 12 || 12;
  return `${h12}:${m}${ampm}`;
}
