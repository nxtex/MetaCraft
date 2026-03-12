import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { auth, setAccessToken, User } from '../lib/api';

interface AuthState {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // On mount: try to restore session from stored refresh token
  useEffect(() => {
    const rt = localStorage.getItem('refresh_token');
    if (!rt) { setLoading(false); return; }

    fetch(`${import.meta.env.VITE_API_URL ?? '/api'}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: rt }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.access_token) {
          setAccessToken(data.access_token);
          localStorage.setItem('refresh_token', data.refresh_token);
          return auth.me();
        }
        throw new Error('no token');
      })
      .then(u => setUser(u))
      .catch(() => { localStorage.removeItem('refresh_token'); })
      .finally(() => setLoading(false));
  }, []);

  async function login(email: string, password: string) {
    const tokens = await auth.login(email, password);
    setAccessToken(tokens.access_token);
    localStorage.setItem('refresh_token', tokens.refresh_token);
    const u = await auth.me();
    setUser(u);
  }

  async function register(name: string, email: string, password: string) {
    const tokens = await auth.register(name, email, password);
    setAccessToken(tokens.access_token);
    localStorage.setItem('refresh_token', tokens.refresh_token);
    const u = await auth.me();
    setUser(u);
  }

  async function logout() {
    const rt = localStorage.getItem('refresh_token') ?? '';
    await auth.logout(rt).catch(() => {});
    setAccessToken(null);
    localStorage.removeItem('refresh_token');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
