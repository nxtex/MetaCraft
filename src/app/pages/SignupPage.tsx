import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { User, Mail, Lock, AlertCircle, Loader2, Layers, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

function passwordStrength(p: string): { score: number; label: string; color: string } {
  let score = 0;
  if (p.length >= 8) score++;
  if (/[A-Z]/.test(p)) score++;
  if (/[0-9]/.test(p)) score++;
  if (/[^A-Za-z0-9]/.test(p)) score++;
  const levels = [
    { label: '', color: 'transparent' },
    { label: 'Faible',    color: '#dc2626' },
    { label: 'Moyen',     color: '#f97316' },
    { label: 'Fort',      color: '#d4af37' },
    { label: 'Tres fort', color: '#10b981' },
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
    if (password.length < 6) { setError('Mot de passe trop court (6 caracteres minimum)'); return; }
    setLoading(true); setError('');
    try {
      await register(name, email, password);
      navigate('/app');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '';
      if (msg.includes('email-already-in-use')) setError('Cet email est deja utilise');
      else setError('Erreur lors de la creation du compte');
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
      setError('Connexion Google annulee ou echouee');
    } finally {
      setLoadingG(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6 py-12">
      {/* Subtle background grid */}
      <div 
        className="fixed inset-0 opacity-[0.02]" 
        style={{
          backgroundImage: `linear-gradient(#d4af37 1px, transparent 1px), linear-gradient(90deg, #d4af37 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} 
      />

      <motion.div 
        className="w-full max-w-md relative z-10"
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6 }}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-3 mb-10 group">
          <div className="w-10 h-10 rounded-full bg-[#d4af37]/10 flex items-center justify-center group-hover:bg-[#d4af37]/20 transition-colors">
            <Layers className="w-5 h-5 text-[#d4af37]" />
          </div>
          <span className="font-cinzel text-xl tracking-[0.2em] text-[#d4af37]">METACRAFT</span>
        </Link>

        {/* Card */}
        <div className="bg-[#111111] border border-[#1a1a1a] p-10">
          <div className="mb-8">
            <h1 className="font-cinzel text-3xl text-[#f5f5f5] mb-2">Creer un compte</h1>
            <p className="text-[#8a8a8a] text-sm font-ibm-plex-mono">
              Rejoignez l'expedition numerique
            </p>
          </div>

          {/* Google Button */}
          <motion.button 
            onClick={handleGoogle} 
            disabled={loadingG || loading}
            className="w-full flex items-center justify-center gap-3 py-4 mb-6 border border-[#2a2a2a] text-[#f5f5f5] font-bebas text-sm tracking-[0.15em] hover:bg-[#1a1a1a] transition-colors disabled:opacity-50"
            whileHover={{ scale: loading || loadingG ? 1 : 1.01 }}
            whileTap={{ scale: loading || loadingG ? 1 : 0.99 }}
          >
            {loadingG ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            CONTINUER AVEC GOOGLE
          </motion.button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-[#2a2a2a]" />
            <span className="text-xs text-[#8a8a8a] font-ibm-plex-mono">ou</span>
            <div className="flex-1 h-px bg-[#2a2a2a]" />
          </div>

          {/* Error */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 p-4 mb-6 bg-[#dc2626]/10 border border-[#dc2626]/30"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-[#dc2626]" />
              <p className="text-sm text-[#dc2626] font-ibm-plex-mono">{error}</p>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block mb-2 text-xs font-bebas tracking-[0.15em] text-[#d4af37]">
                NOM
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a8a8a]" />
                <input 
                  type="text" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  required
                  className="w-full pl-12 pr-4 py-4 bg-[#0a0a0a] border border-[#2a2a2a] text-[#f5f5f5] text-sm font-ibm-plex-mono placeholder:text-[#3a3a3a] focus:border-[#d4af37]/50 focus:outline-none transition-colors"
                  placeholder="Jean Dupont" 
                />
              </div>
            </div>
            
            <div>
              <label className="block mb-2 text-xs font-bebas tracking-[0.15em] text-[#d4af37]">
                EMAIL
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a8a8a]" />
                <input 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  required
                  className="w-full pl-12 pr-4 py-4 bg-[#0a0a0a] border border-[#2a2a2a] text-[#f5f5f5] text-sm font-ibm-plex-mono placeholder:text-[#3a3a3a] focus:border-[#d4af37]/50 focus:outline-none transition-colors"
                  placeholder="vous@exemple.com" 
                />
              </div>
            </div>
            
            <div>
              <label className="block mb-2 text-xs font-bebas tracking-[0.15em] text-[#d4af37]">
                MOT DE PASSE
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a8a8a]" />
                <input 
                  type={showPw ? 'text' : 'password'} 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  required
                  className="w-full pl-12 pr-12 py-4 bg-[#0a0a0a] border border-[#2a2a2a] text-[#f5f5f5] text-sm font-ibm-plex-mono placeholder:text-[#3a3a3a] focus:border-[#d4af37]/50 focus:outline-none transition-colors"
                  placeholder="••••••••" 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPw(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8a8a8a] hover:text-[#f5f5f5] transition-colors"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {password && (
                <div className="mt-3">
                  <div className="flex gap-1 mb-2">
                    {[1,2,3,4].map(i => (
                      <div 
                        key={i} 
                        className="flex-1 h-1 transition-all duration-300"
                        style={{ backgroundColor: i <= strength.score ? strength.color : '#2a2a2a' }} 
                      />
                    ))}
                  </div>
                  <p className="text-xs font-ibm-plex-mono" style={{ color: strength.color }}>
                    {strength.label}
                  </p>
                </div>
              )}
            </div>

            <motion.button 
              type="submit" 
              disabled={loading || loadingG}
              className="w-full py-4 flex items-center justify-center gap-2 bg-[#d4af37] text-[#0a0a0a] font-bebas text-sm tracking-[0.2em] disabled:opacity-50 rounded-full"
              whileHover={{ scale: loading ? 1 : 1.01, boxShadow: loading ? 'none' : '0 0 30px rgba(212, 175, 55, 0.3)' }}
              whileTap={{ scale: loading ? 1 : 0.99 }}
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'CREATION...' : 'CREER MON COMPTE'}
            </motion.button>
          </form>

          <p className="mt-8 text-center text-sm text-[#8a8a8a] font-ibm-plex-mono">
            Deja un compte ?{' '}
            <Link to="/login" className="text-[#d4af37] hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
