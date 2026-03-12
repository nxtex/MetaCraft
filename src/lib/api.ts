import { auth } from './firebase';

const BASE = import.meta.env.VITE_PYTHON_API_URL ?? '';

async function getIdToken(): Promise<string> {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');
  return user.getIdToken();
}

export const metadataApi = {
  // Send file directly, get metadata back
  extract: async (file: File): Promise<Record<string, unknown>> => {
    const token = await getIdToken();
    const form = new FormData();
    form.append('file', file);
    const res = await fetch(`${BASE}/extract`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error((body as Record<string, string>).error ?? `HTTP ${res.status}`);
    }
    return res.json();
  },

  // Send file + edits, get modified file as blob
  edit: async (file: File, edits: Record<string, string>): Promise<{ metadata: Record<string, unknown>; blob: Blob }> => {
    const token = await getIdToken();
    const form = new FormData();
    form.append('file', file);
    form.append('edits', JSON.stringify(edits));
    const res = await fetch(`${BASE}/edit`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error((body as Record<string, string>).error ?? `HTTP ${res.status}`);
    }
    // Backend returns JSON with metadata + base64 file
    const data = await res.json();
    const byteString = atob(data.file_b64);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
    const blob = new Blob([ab], { type: file.type });
    return { metadata: data.metadata, blob };
  },
};
