import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const HEADER_ROW = ['Date', 'Time', 'Food Description', 'Protein (g)', 'Daily Total (g)'];

function getSpreadsheetId() {
  const id = process.env.SPREADSHEET_ID;
  if (!id) throw new Error('SPREADSHEET_ID environment variable is not set');
  return id;
}

function getAuth() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON environment variable is not set');
  const credentials = JSON.parse(raw);
  return new google.auth.GoogleAuth({ credentials, scopes: SCOPES });
}

async function getSheetsClient() {
  const auth = getAuth();
  return google.sheets({ version: 'v4', auth });
}

async function getSheetId(sheets) {
  const spreadsheetId = getSpreadsheetId();
  const meta = await sheets.spreadsheets.get({ spreadsheetId });
  return meta.data.sheets[0].properties.sheetId;
}

export async function ensureHeaderRow() {
  const sheets = await getSheetsClient();
  const spreadsheetId = getSpreadsheetId();

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: 'Sheet1!A1:E1',
  });

  const existing = res.data.values?.[0];
  if (!existing || existing[0] !== 'Date') {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: 'Sheet1!A1:E1',
      valueInputOption: 'RAW',
      requestBody: { values: [HEADER_ROW] },
    });
  }
}

export async function getTodayEntries() {
  const sheets = await getSheetsClient();
  const spreadsheetId = getSpreadsheetId();
  const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD in local time

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: 'Sheet1!A2:E',
  });

  const rows = res.data.values ?? [];
  const entries = [];

  rows.forEach((row, index) => {
    if (row[0] === today) {
      entries.push({
        rowIndex: index + 2, // 1-based, data starts at row 2
        date: row[0],
        time: row[1] ?? '',
        food: row[2] ?? '',
        protein: parseFloat(row[3]) || 0,
        dailyTotal: parseFloat(row[4]) || 0,
      });
    }
  });

  return entries;
}

export async function getAllRows() {
  const sheets = await getSheetsClient();
  const spreadsheetId = getSpreadsheetId();

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: 'Sheet1!A2:E',
  });

  const rows = res.data.values ?? [];
  return rows.map((row, index) => ({
    rowIndex: index + 2,
    date: row[0] ?? '',
    time: row[1] ?? '',
    food: row[2] ?? '',
    protein: parseFloat(row[3]) || 0,
    dailyTotal: parseFloat(row[4]) || 0,
  }));
}

export async function appendEntry({ food, protein }) {
  const sheets = await getSheetsClient();
  const spreadsheetId = getSpreadsheetId();

  const today = new Date().toLocaleDateString('en-CA');
  const time = new Date().toLocaleTimeString('en-US', { hour12: false });

  // Calculate running daily total
  const todayEntries = await getTodayEntries();
  const previousTotal = todayEntries.reduce((sum, e) => sum + e.protein, 0);
  const newDailyTotal = previousTotal + protein;

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: 'Sheet1!A:E',
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    requestBody: {
      values: [[today, time, food, protein, newDailyTotal]],
    },
  });

  return { dailyTotal: newDailyTotal };
}

export async function deleteRow(rowIndex) {
  const sheets = await getSheetsClient();
  const spreadsheetId = getSpreadsheetId();
  const sheetId = await getSheetId(sheets);

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [{
        deleteDimension: {
          range: {
            sheetId,
            dimension: 'ROWS',
            startIndex: rowIndex - 1, // 0-based
            endIndex: rowIndex,       // exclusive — deletes exactly one row
          },
        },
      }],
    },
  });
}
