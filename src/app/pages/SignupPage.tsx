import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { User, Mail, Lock, AlertCircle, Loader2, Sparkles, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

function getStrength(p: string) {
  let score = 0;
  if (p.length >= 8) score++;
  if (/[A-Z]/.test(p)) score++;
  if (/[0-9]/.test(p)) score++;
  if (/[^A-Za-z0-9]/.test(p)) score++;
  const levels = [
    { label: '', color: 'transparent' },
    { label: 'Faible', color: '#f43f5e' },
    { label: 'Moyen', color: '#f59e0b' },
    { label: 'Fort', color: '#c9a84c' },
    { label: 'Excellent', color: '#22c55e' },
  ];
  return { score, ...levels[score] };
}

export function SignupPage() {
  const { register, loginGoogle } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingG, setLoadingG] = useState(false);
  const [error, setError] = useState('');

  const strength = getStrength(password);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 6) {
      setError('Mot de passe trop court (6 caracteres minimum)');
      return;
    }
    setLoading(true);
    setError('');
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
    setLoadingG(true);
    setError('');
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
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-6 py-16">
      {/* Grid background */}
      <div 
        className="fixed inset-0 opacity-[0.015]" 
        style={{
          backgroundImage: `linear-gradient(#c9a84c 1px, transparent 1px), linear-gradient(90deg, #c9a84c 1px, transparent 1px)`,
          backgroundSize: '80px 80px'
        }} 
      />

      <motion.div 
        className="w-full max-w-sm relative z-10"
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6 }}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-3 mb-12">
          <div className="w-10 h-10 bg-[#c9a84c]/10 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-[#c9a84c]" />
          </div>
          <span className="text-sm tracking-[0.3em] text-[#c9a84c]" style={{ fontFamily: 'Bebas Neue, cursive' }}>
            METACRAFT
          </span>
        </Link>

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-2xl mb-2 text-[#f5f5f5]" style={{ fontFamily: 'Cinzel, serif' }}>
            Creer un compte
          </h1>
          <p className="text-sm text-[#6b6b6b]" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
            Rejoignez MetaCraft
          </p>
        </div>

        {/* Google */}
        <motion.button 
          onClick={handleGoogle} 
          disabled={loadingG || loading}
          className="w-full flex items-center justify-center gap-3 py-4 mb-6 border border-[#1c1c1c] text-[#f5f5f5] text-xs tracking-[0.15em] hover:bg-[#0f0f0f] transition-colors disabled:opacity-50"
          style={{ fontFamily: 'Bebas Neue, cursive' }}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
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
          <div className="flex-1 h-px bg-[#1c1c1c]" />
          <span className="text-[10px] text-[#3f3f3f]" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>ou</span>
          <div className="flex-1 h-px bg-[#1c1c1c]" />
        </div>

        {/* Error */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 p-4 mb-6 bg-[#f43f5e]/5 border border-[#f43f5e]/20"
          >
            <AlertCircle className="w-4 h-4 text-[#f43f5e]" />
            <p className="text-xs text-[#f43f5e]" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>{error}</p>
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-2 text-[10px] text-[#c9a84c]" style={{ fontFamily: 'Bebas Neue, cursive' }}>
              NOM
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3f3f3f]" />
              <input 
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                required
                className="w-full pl-12 pr-4 py-4 bg-[#0a0a0a] border border-[#1c1c1c] text-[#f5f5f5] text-sm placeholder:text-[#262626] focus:border-[#c9a84c]/30 focus:outline-none transition-colors"
                style={{ fontFamily: 'IBM Plex Mono, monospace' }}
                placeholder="Jean Dupont" 
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-[10px] text-[#c9a84c]" style={{ fontFamily: 'Bebas Neue, cursive' }}>
              EMAIL
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3f3f3f]" />
              <input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required
                className="w-full pl-12 pr-4 py-4 bg-[#0a0a0a] border border-[#1c1c1c] text-[#f5f5f5] text-sm placeholder:text-[#262626] focus:border-[#c9a84c]/30 focus:outline-none transition-colors"
                style={{ fontFamily: 'IBM Plex Mono, monospace' }}
                placeholder="vous@exemple.com" 
              />
            </div>
          </div>
          
          <div>
            <label className="block mb-2 text-[10px] text-[#c9a84c]" style={{ fontFamily: 'Bebas Neue, cursive' }}>
              MOT DE PASSE
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3f3f3f]" />
              <input 
                type={showPw ? 'text' : 'password'}
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required
                className="w-full pl-12 pr-12 py-4 bg-[#0a0a0a] border border-[#1c1c1c] text-[#f5f5f5] text-sm placeholder:text-[#262626] focus:border-[#c9a84c]/30 focus:outline-none transition-colors"
                style={{ fontFamily: 'IBM Plex Mono, monospace' }}
                placeholder="••••••••" 
              />
              <button 
                type="button" 
                onClick={() => setShowPw(v => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#3f3f3f] hover:text-[#6b6b6b] transition-colors"
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {password && (
              <div className="mt-3">
                <div className="flex gap-1 mb-2">
                  {[1, 2, 3, 4].map(i => (
                    <div 
                      key={i} 
                      className="flex-1 h-0.5 transition-all duration-300"
                      style={{ backgroundColor: i <= strength.score ? strength.color : '#1c1c1c' }} 
                    />
                  ))}
                </div>
                {strength.label && (
                  <p className="text-[10px]" style={{ fontFamily: 'IBM Plex Mono, monospace', color: strength.color }}>
                    {strength.label}
                  </p>
                )}
              </div>
            )}
          </div>

          <motion.button 
            type="submit" 
            disabled={loading || loadingG}
            className="w-full py-4 flex items-center justify-center gap-2 bg-[#c9a84c] text-[#050505] text-xs tracking-[0.2em] disabled:opacity-50"
            style={{ fontFamily: 'Bebas Neue, cursive' }}
            whileHover={{ scale: 1.01, boxShadow: '0 0 30px rgba(201, 168, 76, 0.2)' }}
            whileTap={{ scale: 0.99 }}
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? 'CREATION...' : 'CREER MON COMPTE'}
          </motion.button>
        </form>

        <p className="mt-10 text-center text-xs text-[#6b6b6b]" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
          Deja un compte ?{' '}
          <Link to="/login" className="text-[#c9a84c] hover:underline">
            Se connecter
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
