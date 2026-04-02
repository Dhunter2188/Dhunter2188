const TARGET = 185;

export default function DailyProgress({ dailyTotal }) {
  const pct = Math.min((dailyTotal / TARGET) * 100, 100);
  const over = dailyTotal > TARGET;

  return (
    <div className="card daily-progress">
      <div className="progress-header">
        <h2>Today's Protein</h2>
        <div className="progress-numbers">
          {dailyTotal.toFixed(1)}g <span>/ {TARGET}g goal</span>
        </div>
      </div>
      <div className="progress-bar-track">
        <div
          className={`progress-bar-fill${over ? ' over-target' : ''}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="progress-label">
        {over
          ? `${(dailyTotal - TARGET).toFixed(1)}g over target`
          : `${(TARGET - dailyTotal).toFixed(1)}g remaining`}
      </div>
    </div>
  );
}
