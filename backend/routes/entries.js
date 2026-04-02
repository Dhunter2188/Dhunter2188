import { Router } from 'express';
import { getTodayEntries, getAllRows } from '../services/sheets.js';

const router = Router();
const TARGET = 185;

// Today's entries + daily total
router.get('/today', async (_req, res, next) => {
  try {
    const entries = await getTodayEntries();
    const dailyTotal = entries.reduce((sum, e) => sum + e.protein, 0);
    res.json({ entries, dailyTotal, target: TARGET });
  } catch (err) {
    next(err);
  }
});

// History: past days aggregated (excludes today)
router.get('/history', async (_req, res, next) => {
  try {
    const allRows = await getAllRows();
    const today = new Date().toLocaleDateString('en-CA');

    const byDate = {};
    for (const row of allRows) {
      if (!row.date || row.date === today) continue;
      byDate[row.date] = (byDate[row.date] ?? 0) + row.protein;
    }

    const days = Object.entries(byDate)
      .map(([date, total]) => ({ date, total, hitTarget: total >= TARGET }))
      .sort((a, b) => b.date.localeCompare(a.date));

    res.json({ days });
  } catch (err) {
    next(err);
  }
});

export default router;
