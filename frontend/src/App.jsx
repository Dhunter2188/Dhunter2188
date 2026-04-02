import { useState, useEffect, useCallback } from 'react';
import { parseFood, logEntry, deleteEntry, fetchToday } from './api.js';
import FoodEntry from './components/FoodEntry.jsx';
import ParsePreview from './components/ParsePreview.jsx';
import DailyProgress from './components/DailyProgress.jsx';
import EntryList from './components/EntryList.jsx';
import HistoryView from './components/HistoryView.jsx';

export default function App() {
  const [todayEntries, setTodayEntries] = useState([]);
  const [dailyTotal, setDailyTotal] = useState(0);
  const [view, setView] = useState('today');
  const [pendingParse, setPendingParse] = useState(null); // { items, totalProtein, rawInput }
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [deletingRow, setDeletingRow] = useState(null);
  const [error, setError] = useState(null);

  const loadToday = useCallback(async () => {
    try {
      const data = await fetchToday();
      setTodayEntries(data.entries);
      setDailyTotal(data.dailyTotal);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    loadToday();
  }, [loadToday]);

  async function handleParse(input) {
    setError(null);
    setLoading(true);
    try {
      const result = await parseFood(input);
      setPendingParse({ ...result, rawInput: input });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirm(food, protein) {
    setError(null);
    setConfirming(true);
    try {
      await logEntry(food, protein);
      setPendingParse(null);
      await loadToday();
    } catch (err) {
      setError(err.message);
    } finally {
      setConfirming(false);
    }
  }

  async function handleDelete(rowIndex) {
    setError(null);
    setDeletingRow(rowIndex);
    try {
      await deleteEntry(rowIndex);
      await loadToday();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingRow(null);
    }
  }

  return (
    <>
      <header className="app-header">
        <h1>Protein Tracker</h1>
        <nav className="nav-tabs">
          <button
            className={`nav-tab${view === 'today' ? ' active' : ''}`}
            onClick={() => setView('today')}
          >
            Today
          </button>
          <button
            className={`nav-tab${view === 'history' ? ' active' : ''}`}
            onClick={() => setView('history')}
          >
            History
          </button>
        </nav>
      </header>

      {error && <div className="error-msg">{error}</div>}

      {view === 'today' && (
        <>
          <DailyProgress dailyTotal={dailyTotal} />

          {pendingParse ? (
            <ParsePreview
              data={pendingParse}
              onConfirm={handleConfirm}
              onCancel={() => setPendingParse(null)}
              loading={confirming}
            />
          ) : (
            <FoodEntry onParse={handleParse} loading={loading} />
          )}

          <EntryList
            entries={todayEntries}
            onDelete={handleDelete}
            deletingRow={deletingRow}
          />
        </>
      )}

      {view === 'history' && <HistoryView />}
    </>
  );
}
