const BASE = '/api';

async function handleResponse(res) {
  if (!res.ok) {
    const text = await res.text();
    let message;
    try {
      message = JSON.parse(text).error;
    } catch {
      message = text;
    }
    throw new Error(message || `Request failed: ${res.status}`);
  }
  return res.json();
}

export async function parseFood(input) {
  const res = await fetch(`${BASE}/parse`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input }),
  });
  return handleResponse(res);
}

export async function logEntry(food, protein) {
  const res = await fetch(`${BASE}/log`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ food, protein }),
  });
  return handleResponse(res);
}

export async function deleteEntry(rowIndex) {
  const res = await fetch(`${BASE}/entry/${rowIndex}`, { method: 'DELETE' });
  return handleResponse(res);
}

export async function fetchToday() {
  const res = await fetch(`${BASE}/today`);
  return handleResponse(res);
}

export async function fetchHistory() {
  const res = await fetch(`${BASE}/history`);
  return handleResponse(res);
}
