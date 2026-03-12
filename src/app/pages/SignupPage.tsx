import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { User, Mail, Lock, AlertCircle, Loader2, Brush, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

function passwordStrength(p: string): { score: number; label: string; color: string } {
  let score = 0;
  if (p.length >= 8) score++;
  if (/[A-Z]/.test(p)) score++;
  if (/[0-9]/.test(p)) score++;
  if (/[^A-Za-z0-9]/.test(p)) score++;
  const levels = [
    { label: '', color: 'transparent' },
    { label: 'Faible',    color: '#C0392B' },
    { label: 'Moyen',     color: '#E8732A' },
    { label: 'Fort',      color: '#C9A84C' },
    { label: 'Très fort', color: '#2AFC98' },
  ];
  return { score, ...levels[score] };
}

export function SignupPage() {
  const { register, loginGoogle } = useAuth();
  const navigate = useNavigate();

  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [loadingG, setLoadingG] = useState(false);
  const [error, setError]       = useState('');

  const strength = passwordStrength(password);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 6) { setError('Mot de passe trop court (6 caractères minimum)'); return; }
    setLoading(true); setError('');
    try {
      await register(name, email, password);
      navigate('/app');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '';
      if (msg.includes('email-already-in-use')) setError('Cet email est déjà utilisé');
      else setError('Erreur lors de la création du compte');
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setLoadingG(true); setError('');
    try {
      await loginGoogle();
      navigate('/app');
    } catch {
      setError('Connexion Google annulée ou échouée');
    } finally {
      setLoadingG(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ backgroundColor: '#080A0F' }}>
      <motion.div className="w-full max-w-[440px]"
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>

        <div className="flex items-center justify-center gap-2 mb-8">
          <Brush className="w-6 h-6" style={{ color: '#C9A84C' }} />
          <span style={{ fontFamily: 'Cinzel, serif', color: '#C9A84C', letterSpacing: '3px', fontSize: '22px' }}>MetaCraft</span>
        </div>

        <div style={{ backgroundColor: '#141C2A', border: '1px solid rgba(201,168,76,0.2)', padding: '32px' }}>
          <h1 className="text-2xl mb-1" style={{ fontFamily: 'Cinzel, serif', color: '#EDE8DC' }}>Créer un compte</h1>
          <p className="mb-6 text-sm" style={{ fontFamily: 'IBM Plex Mono, monospace', color: '#7A7060' }}>Rejoignez l’expédition numérique</p>

          {/* Google */}
          <motion.button onClick={handleGoogle} disabled={loadingG || loading}
            className="w-full flex items-center justify-center gap-3 py-3 mb-4"
            style={{ border: '1px solid rgba(201,168,76,0.3)', fontFamily: 'Bebas Neue, cursive', letterSpacing: '2px', color: '#EDE8DC', fontSize: '14px' }}
            whileHover={{ backgroundColor: 'rgba(201,168,76,0.06)' }}
            whileTap={{ scale: 0.98 }}>
            {loadingG
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            }
            CONTINUER AVEC GOOGLE
          </motion.button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(201,168,76,0.15)' }} />
            <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '12px', color: '#7A7060' }}>ou</span>
            <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(201,168,76,0.15)' }} />
          </div>

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex items-center gap-2 p-3 mb-4"
              style={{ backgroundColor: 'rgba(192,57,43,0.15)', border: '1px solid rgba(192,57,43,0.4)' }}>
              <AlertCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#C0392B' }} />
              <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '13px', color: '#C0392B' }}>{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1.5 text-xs" style={{ fontFamily: 'Bebas Neue, cursive', letterSpacing: '2px', color: '#C9A84C' }}>NOM</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#7A7060' }} />
                <input type="text" value={name} onChange={e => setName(e.target.value)} required
                  className="w-full pl-10 pr-4 py-3 outline-none"
                  style={{ backgroundColor: '#0E1520', border: '1px solid rgba(201,168,76,0.2)', fontFamily: 'IBM Plex Mono, monospace', color: '#EDE8DC', fontSize: '14px' }}
                  placeholder="Jean Dupont" />
              </div>
            </div>
            <div>
              <label className="block mb-1.5 text-xs" style={{ fontFamily: 'Bebas Neue, cursive', letterSpacing: '2px', color: '#C9A84C' }}>EMAIL</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#7A7060' }} />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  className="w-full pl-10 pr-4 py-3 outline-none"
                  style={{ backgroundColor: '#0E1520', border: '1px solid rgba(201,168,76,0.2)', fontFamily: 'IBM Plex Mono, monospace', color: '#EDE8DC', fontSize: '14px' }}
                  placeholder="vous@exemple.com" />
              </div>
            </div>
            <div>
              <label className="block mb-1.5 text-xs" style={{ fontFamily: 'Bebas Neue, cursive', letterSpacing: '2px', color: '#C9A84C' }}>MOT DE PASSE</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#7A7060' }} />
                <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                  className="w-full pl-10 pr-10 py-3 outline-none"
                  style={{ backgroundColor: '#0E1520', border: '1px solid rgba(201,168,76,0.2)', fontFamily: 'IBM Plex Mono, monospace', color: '#EDE8DC', fontSize: '14px' }}
                  placeholder="••••••••" />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2">
                  {showPw ? <EyeOff className="w-4 h-4" style={{ color: '#7A7060' }} /> : <Eye className="w-4 h-4" style={{ color: '#7A7060' }} />}
                </button>
              </div>
              {password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="flex-1 h-1 transition-all"
                        style={{ backgroundColor: i <= strength.score ? strength.color : 'rgba(201,168,76,0.15)' }} />
                    ))}
                  </div>
                  <p className="text-xs" style={{ fontFamily: 'IBM Plex Mono, monospace', color: strength.color }}>{strength.label}</p>
                </div>
              )}
            </div>

            <motion.button type="submit" disabled={loading || loadingG}
              className="w-full py-3 flex items-center justify-center gap-2"
              style={{ backgroundColor: '#C9A84C', color: '#080A0F', fontFamily: 'Bebas Neue, cursive', letterSpacing: '3px', fontSize: '15px' }}
              whileHover={!loading ? { scale: 1.01, boxShadow: '0 0 20px rgba(201,168,76,0.4)' } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {loading ? 'CRÉATION...' : 'CRÉER MON COMPTE'}
            </motion.button>
          </form>

          <p className="mt-5 text-center text-sm" style={{ fontFamily: 'IBM Plex Mono, monospace', color: '#7A7060' }}>
            Déjà un compte ?{' '}
            <Link to="/login" style={{ color: '#C9A84C', textDecoration: 'none' }}>Se connecter</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
