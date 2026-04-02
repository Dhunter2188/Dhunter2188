export default function ParsePreview({ data, onConfirm, onCancel, loading }) {
  const { items, totalProtein, rawInput } = data;

  return (
    <div className="card parse-preview">
      <h3>Confirm Entry</h3>
      <ul className="parse-items">
        {items.map((item, i) => (
          <li key={i} className="parse-item">
            <span className="parse-item-name">{item.food}</span>
            <span className="parse-item-protein">{item.protein}g</span>
          </li>
        ))}
      </ul>
      <div className="parse-total">
        <span>Total protein</span>
        <span>{totalProtein.toFixed(1)}g</span>
      </div>
      <div className="parse-actions">
        <button className="btn-secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </button>
        <button
          className="btn-primary"
          onClick={() => onConfirm(rawInput, totalProtein)}
          disabled={loading}
        >
          {loading ? <><span className="spinner" />Saving…</> : 'Confirm & Log'}
        </button>
      </div>
    </div>
  );
}
