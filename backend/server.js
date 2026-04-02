import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import foodRouter from './routes/food.js';
import entriesRouter from './routes/entries.js';
import { ensureHeaderRow } from './services/sheets.js';

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors({
  origin: [
    'http://localhost:5173',
    /^http:\/\/192\.168\./,
    /^http:\/\/10\./,
    /^http:\/\/172\.(1[6-9]|2\d|3[01])\./,
  ],
}));
app.use(express.json());

app.use('/api', foodRouter);
app.use('/api', entriesRouter);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status ?? 500).json({ error: err.message ?? 'Internal server error' });
});

ensureHeaderRow()
  .then(() => console.log('Sheet headers verified'))
  .catch((err) => console.error('Sheet init failed (check GOOGLE_SERVICE_ACCOUNT_JSON and SPREADSHEET_ID):', err.message));

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
