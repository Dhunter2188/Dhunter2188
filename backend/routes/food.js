import { Router } from 'express';
import { parseProtein } from '../services/anthropic.js';
import { appendEntry, deleteRow } from '../services/sheets.js';

const router = Router();

// Parse food input without logging
router.post('/parse', async (req, res, next) => {
  try {
    const { input } = req.body;
    if (!input || typeof input !== 'string' || !input.trim()) {
      return res.status(400).json({ error: 'input is required' });
    }
    const result = await parseProtein(input.trim());
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// Log a confirmed entry to Google Sheets
router.post('/log', async (req, res, next) => {
  try {
    const { food, protein } = req.body;
    if (!food || typeof food !== 'string' || !food.trim()) {
      return res.status(400).json({ error: 'food is required' });
    }
    if (typeof protein !== 'number' || protein < 0) {
      return res.status(400).json({ error: 'protein must be a non-negative number' });
    }
    const result = await appendEntry({ food: food.trim(), protein });
    res.json({ success: true, dailyTotal: result.dailyTotal });
  } catch (err) {
    next(err);
  }
});

// Delete an entry by sheet row index
router.delete('/entry/:rowIndex', async (req, res, next) => {
  try {
    const rowIndex = parseInt(req.params.rowIndex, 10);
    if (isNaN(rowIndex) || rowIndex < 2) {
      return res.status(400).json({ error: 'rowIndex must be an integer >= 2' });
    }
    await deleteRow(rowIndex);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default router;
