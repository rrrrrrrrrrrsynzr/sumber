const STORAGE_KEY = 'pradnyasiwi-quadtech-feedback';
const apiUrl = import.meta.env.VITE_FEEDBACK_API_URL?.trim();

async function readResponse(response) {
  if (!response.ok) {
    throw new Error(`Permintaan gagal dengan status ${response.status}.`);
  }
  if (response.status === 204) return null;
  return response.json();
}

export async function getFeedback() {
  if (apiUrl) {
    const response = await fetch(apiUrl, { headers: { Accept: 'application/json' } });
    const payload = await readResponse(response);
    return Array.isArray(payload) ? payload : payload?.feedback ?? [];
  }

  const saved = window.localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
}

export async function submitFeedback(feedback) {
  const entry = {
    ...feedback,
    id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    createdAt: new Date().toISOString(),
  };

  if (apiUrl) {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(feedback),
    });
    const payload = await readResponse(response);
    return payload?.feedback ?? payload ?? entry;
  }

  const previous = await getFeedback();
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([entry, ...previous].slice(0, 100)));
  return entry;
}
