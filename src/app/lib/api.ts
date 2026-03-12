const BASE = import.meta.env.VITE_API_URL ?? '/api';

let accessToken: string | null = null;

export function setAccessToken(t: string | null) {
  accessToken = t;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;

  const res = await fetch(`${BASE}${path}`, { ...options, headers });

  // Auto-refresh on 401
  if (res.status === 401) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      headers['Authorization'] = `Bearer ${accessToken}`;
      const retry = await fetch(`${BASE}${path}`, { ...options, headers });
      if (!retry.ok) throw new APIError(retry.status, await retry.json());
      return retry.json();
    }
    throw new APIError(401, { error: 'Unauthorized' });
  }

  if (!res.ok) throw new APIError(res.status, await res.json());
  if (res.status === 204) return undefined as T;
  return res.json();
}

async function tryRefresh(): Promise<boolean> {
  const rt = localStorage.getItem('refresh_token');
  if (!rt) return false;
  try {
    const data = await fetch(`${BASE}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: rt }),
    }).then(r => r.json());
    if (data.access_token) {
      accessToken = data.access_token;
      localStorage.setItem('refresh_token', data.refresh_token);
      return true;
    }
  } catch { /* ignore */ }
  return false;
}

export class APIError extends Error {
  constructor(public status: number, public body: Record<string, string>) {
    super(body?.error ?? 'Request failed');
  }
}

// ── Auth ────────────────────────────────────────────
export const auth = {
  register: (name: string, email: string, password: string) =>
    request<TokenResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),
  login: (email: string, password: string) =>
    request<TokenResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  logout: (refreshToken: string) =>
    request<void>('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    }),
  me: () => request<User>('/auth/me'),
};

// ── Files ───────────────────────────────────────────
export const files = {
  upload: (formData: FormData) =>
    fetch(`${BASE}/files/upload`, {
      method: 'POST',
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
      body: formData,
    }).then(r => r.json()) as Promise<UploadResponse>,

  history: () => request<FileRecord[]>('/files/history'),

  getFile: (id: string) => request<{ download_url: string }>(`/files/${id}`),

  getMetadata: (id: string) => request<Record<string, unknown>>(`/files/${id}/metadata`),

  updateMetadata: (id: string, edits: Record<string, unknown>) =>
    request<Record<string, unknown>>(`/files/${id}/metadata`, {
      method: 'PATCH',
      body: JSON.stringify(edits),
    }),

  deleteFile: (id: string) => request<void>(`/files/${id}`, { method: 'DELETE' }),

  batchAnalyze: (fileIds: string[]) =>
    request<BatchAnalysisResponse>('/files/batch/analyze', {
      method: 'POST',
      body: JSON.stringify({ file_ids: fileIds }),
    }),
};

// ── Types ──────────────────────────────────────────
export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}
export interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
}
export interface FileRecord {
  id: string;
  original_name: string;
  mime_type: string;
  size_bytes: number;
  created_at: string;
}
export interface UploadResponse {
  file_id: string;
  name: string;
  mime: string;
  size: number;
  metadata: Record<string, unknown>;
}
export interface BatchAnalysisResponse {
  files: FileRecord[];
  analysis: {
    total_files: number;
    format_dist: { ext: string; count: number }[];
    files_by_year: { year: string; count: number }[];
    size_stats: { total_bytes: number; mean_bytes: number; median_bytes: number; max_bytes: number; min_bytes: number };
    gps_count: number;
    period: { from: string; to: string };
  };
}
