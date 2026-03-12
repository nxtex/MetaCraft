import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Brush, User, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: '8 caractères min.', ok: password.length >= 8 },
    { label: 'Majuscule', ok: /[A-Z]/.test(password) },
    { label: 'Chiffre', ok: /[0-9]/.test(password) },
    { label: 'Caract. spécial', ok: /[^A-Za-z0-9]/.test(password) },
  ];
  const score = checks.filter(c => c.ok).length;
  const colors = ['#C0392B', '#E8732A', '#C9A84C', '#2AFC98'];
  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-2">
        {[0, 1, 2, 3].map(i => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full transition-all"
            style={{ backgroundColor: i < score ? colors[score - 1] : 'rgba(122,112,96,0.3)' }}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {checks.map(c => (
          <span
            key={c.label}
            className="text-xs flex items-center gap-1"
            style={{ color: c.ok ? '#2AFC98' : '#7A7060', fontFamily: 'IBM Plex Mono, monospace' }}
          >
            {c.ok ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
            {c.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export function SignupPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création du compte');
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = {
    backgroundColor: '#141C2A',
    border: '1px solid rgba(201, 168, 76, 0.2)',
    fontFamily: 'IBM Plex Mono, monospace',
    color: '#EDE8DC',
    fontSize: '14px',
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-8"
      style={{ backgroundColor: '#080A0F' }}
    >
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <Brush className="w-7 h-7" style={{ color: '#C9A84C' }} />
            <span className="text-3xl" style={{ fontFamily: 'Cinzel, serif', color: '#C9A84C' }}>MetaCraft</span>
          </div>
          <p className="text-xs tracking-widest" style={{ fontFamily: 'Bebas Neue, cursive', color: '#7A7060', letterSpacing: '4px' }}>
            OUTIL D’EXCAVATION NUMÉRIQUE
          </p>
        </div>

        <div
          className="p-8"
          style={{
            backgroundColor: '#0E1219',
            border: '1px solid rgba(201, 168, 76, 0.2)',
            clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)',
          }}
        >
          <h2 className="text-2xl mb-8" style={{ fontFamily: 'Cinzel, serif', color: '#EDE8DC' }}>
            Créer un compte
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
            <div>
              <label className="block mb-2 text-xs" style={{ fontFamily: 'Bebas Neue, cursive', letterSpacing: '2px', color: '#C9A84C' }}>Nom complet</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#7A7060' }} />
                <input type="text" value={name} onChange={e => setName(e.target.value)} required minLength={2}
                  placeholder="Dr. Anas Mesri" className="w-full pl-10 pr-4 py-3 outline-none transition-all" style={inputStyle}
                  onFocus={e => e.currentTarget.style.borderColor = 'rgba(201, 168, 76, 0.6)'}
                  onBlur={e => e.currentTarget.style.borderColor = 'rgba(201, 168, 76, 0.2)'}
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-xs" style={{ fontFamily: 'Bebas Neue, cursive', letterSpacing: '2px', color: '#C9A84C' }}>Adresse email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#7A7060' }} />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  placeholder="vous@exemple.com" className="w-full pl-10 pr-4 py-3 outline-none transition-all" style={inputStyle}
                  onFocus={e => e.currentTarget.style.borderColor = 'rgba(201, 168, 76, 0.6)'}
                  onBlur={e => e.currentTarget.style.borderColor = 'rgba(201, 168, 76, 0.2)'}
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-xs" style={{ fontFamily: 'Bebas Neue, cursive', letterSpacing: '2px', color: '#C9A84C' }}>Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#7A7060' }} />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                  placeholder="••••••••" className="w-full pl-10 pr-12 py-3 outline-none transition-all" style={inputStyle}
                  onFocus={e => e.currentTarget.style.borderColor = 'rgba(201, 168, 76, 0.6)'}
                  onBlur={e => e.currentTarget.style.borderColor = 'rgba(201, 168, 76, 0.2)'}
                />
                <button type="button" onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#7A7060' }}>
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {password && <PasswordStrength password={password} />}
            </div>

            <motion.button type="submit" disabled={loading}
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
              {loading ? 'CRÉATION...' : 'CRÉER MON COMPTE'}
            </motion.button>
          </form>

          <p className="text-center mt-6 text-sm" style={{ fontFamily: 'IBM Plex Mono, monospace', color: '#7A7060' }}>
            Déjà un compte ?{' '}
            <Link to="/login" style={{ color: '#C9A84C' }} className="hover:brightness-125 transition-all">Se connecter</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
