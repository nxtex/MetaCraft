import { auth } from './firebase';

const BASE = import.meta.env.VITE_PYTHON_API_URL ?? '';

async function getIdToken(): Promise<string> {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');
  return user.getIdToken();
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = await getIdToken();
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers as Record<string, string>),
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as Record<string, string>).error ?? `HTTP ${res.status}`);
  }
  return res.json();
}

export const metadataApi = {
  extract: (storagePath: string, mimeType: string) =>
    request<Record<string, unknown>>('/extract', {
      method: 'POST',
      body: JSON.stringify({ storage_path: storagePath, mime_type: mimeType }),
    }),

  edit: (storagePath: string, mimeType: string, edits: Record<string, string>) =>
    request<Record<string, unknown>>('/edit', {
      method: 'POST',
      body: JSON.stringify({ storage_path: storagePath, mime_type: mimeType, edits }),
    }),
};
