async function readJson(response) {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || 'Masukan belum berhasil dikirim. Coba lagi nanti.');
  return payload;
}

export async function submitFeedback(feedback) {
  const response = await fetch('/api/feedback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(feedback),
  });
  return readJson(response);
}

export async function getAdminFeedback(credentials) {
  const response = await fetch('/api/admin/feedback', {
    headers: {
      Accept: 'application/json',
      Authorization: `Basic ${credentials}`,
    },
    cache: 'no-store',
  });
  return readJson(response);
}
