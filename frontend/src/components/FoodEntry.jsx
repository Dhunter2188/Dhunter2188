import { useState } from 'react';

export default function FoodEntry({ onParse, loading }) {
  const [input, setInput] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    onParse(trimmed);
    setInput('');
  }

  return (
    <div className="card food-entry">
      <form onSubmit={handleSubmit}>
        <input
          className="food-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. 3 eggs and a cup of Greek yogurt"
          disabled={loading}
          autoFocus
        />
        <button className="btn-primary" type="submit" disabled={loading || !input.trim()}>
          {loading ? <><span className="spinner" />Analyzing…</> : 'Log Food'}
        </button>
      </form>
    </div>
  );
}
