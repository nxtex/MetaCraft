import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { motion } from 'motion/react';
import { Brush, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: Location })?.from?.pathname ?? '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: '#080A0F' }}
    >
      {/* Background glyphs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5" aria-hidden>
        {['ዳ', 'ዓ', '፡', '፦', '☥', 'ᚷ', 'ᚪ', 'ᚨ'].map((g, i) => (
          <span
            key={i}
            className="absolute text-6xl select-none"
            style={{
              color: '#C9A84C',
              top: `${10 + i * 11}%`,
              left: `${5 + i * 12}%`,
              transform: `rotate(${i * 17}deg)`,
            }}
          >{g}</span>
        ))}
      </div>

      <motion.div
        className="w-full max-w-md relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <motion.div
            className="inline-flex items-center gap-3 mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <Brush className="w-7 h-7" style={{ color: '#C9A84C' }} />
            <span
              className="text-3xl tracking-wide"
              style={{ fontFamily: 'Cinzel, serif', color: '#C9A84C' }}
            >
              MetaCraft
            </span>
          </motion.div>
          <p
            className="text-xs tracking-widest"
            style={{ fontFamily: 'Bebas Neue, cursive', color: '#7A7060', letterSpacing: '4px' }}
          >
            OUTIL D’EXCAVATION NUMÉRIQUE
          </p>
        </div>

        {/* Card */}
        <div
          className="p-8"
          style={{
            backgroundColor: '#0E1219',
            border: '1px solid rgba(201, 168, 76, 0.2)',
            clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)',
          }}
        >
          <h2
            className="text-2xl mb-8"
            style={{ fontFamily: 'Cinzel, serif', color: '#EDE8DC' }}
          >
            Connexion
          </h2>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 p-4 mb-6"
              style={{ backgroundColor: 'rgba(192, 57, 43, 0.15)', border: '1px solid rgba(192, 57, 43, 0.4)' }}
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#C0392B' }} />
              <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '13px', color: '#C0392B' }}>{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label
                className="block mb-2 text-xs"
                style={{ fontFamily: 'Bebas Neue, cursive', letterSpacing: '2px', color: '#C9A84C' }}
              >
                Adresse email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#7A7060' }} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="vous@exemple.com"
                  className="w-full pl-10 pr-4 py-3 outline-none transition-all"
                  style={{
                    backgroundColor: '#141C2A',
                    border: '1px solid rgba(201, 168, 76, 0.2)',
                    fontFamily: 'IBM Plex Mono, monospace',
                    color: '#EDE8DC',
                    fontSize: '14px',
                  }}
                  onFocus={e => e.currentTarget.style.borderColor = 'rgba(201, 168, 76, 0.6)'}
                  onBlur={e => e.currentTarget.style.borderColor = 'rgba(201, 168, 76, 0.2)'}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                className="block mb-2 text-xs"
                style={{ fontFamily: 'Bebas Neue, cursive', letterSpacing: '2px', color: '#C9A84C' }}
              >
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#7A7060' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 outline-none transition-all"
                  style={{
                    backgroundColor: '#141C2A',
                    border: '1px solid rgba(201, 168, 76, 0.2)',
                    fontFamily: 'IBM Plex Mono, monospace',
                    color: '#EDE8DC',
                    fontSize: '14px',
                  }}
                  onFocus={e => e.currentTarget.style.borderColor = 'rgba(201, 168, 76, 0.6)'}
                  onBlur={e => e.currentTarget.style.borderColor = 'rgba(201, 168, 76, 0.2)'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: '#7A7060' }}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-2 transition-all"
              style={{
                backgroundColor: loading ? 'rgba(201, 168, 76, 0.5)' : '#C9A84C',
                color: '#080A0F',
                fontFamily: 'Bebas Neue, cursive',
                letterSpacing: '4px',
                fontSize: '16px',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
              whileHover={!loading ? { scale: 1.02, boxShadow: '0 0 20px rgba(201, 168, 76, 0.4)' } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
            >
              {loading ? 'CONNEXION...' : 'SE CONNECTER'}
            </motion.button>
          </form>

          <p
            className="text-center mt-6 text-sm"
            style={{ fontFamily: 'IBM Plex Mono, monospace', color: '#7A7060' }}
          >
            Pas encore de compte ?{' '}
            <Link
              to="/signup"
              style={{ color: '#C9A84C' }}
              className="hover:brightness-125 transition-all"
            >
              Créer un compte
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
