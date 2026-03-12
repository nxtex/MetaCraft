import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Brush, Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { StratumCard } from '../components/StratumCard';
import { FloatingParticles } from '../components/FloatingParticles';

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login
    setTimeout(() => {
      setIsLoading(false);
      navigate('/');
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: '#080A0F' }}>
      <FloatingParticles />
      
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              width: '200px',
              height: '200px',
              border: '1px solid rgba(201, 168, 76, 0.05)',
              borderRadius: '50%',
              left: `${20 + i * 20}%`,
              top: `${30 + i * 10}%`,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.1, 0.3, 0.1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20 + i * 3,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md px-6"
      >
        {/* Logo header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center justify-center mb-6"
            whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
            transition={{ duration: 0.5 }}
          >
            <Brush className="w-16 h-16" style={{ color: '#C9A84C' }} />
          </motion.div>
          <h1
            className="text-5xl mb-3"
            style={{ fontFamily: 'Cinzel, serif', color: '#EDE8DC' }}
          >
            MetaCraft
          </h1>
          <p
            className="text-sm"
            style={{
              fontFamily: 'Bebas Neue, cursive',
              letterSpacing: '4px',
              color: '#C9A84C',
            }}
          >
            EXCAVATION NUMÉRIQUE
          </p>
        </motion.div>

        <StratumCard className="p-8 relative overflow-hidden">
          {/* Animated glow effect */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(201, 168, 76, 0.1), transparent)',
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          <motion.h2
            className="text-2xl mb-2 relative z-10"
            style={{ fontFamily: 'Cinzel, serif', color: '#EDE8DC' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Accès aux Archives
          </motion.h2>
          <motion.p
            className="text-sm mb-8 relative z-10"
            style={{ fontFamily: 'IBM Plex Mono, monospace', color: '#7A7060' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Authentifiez-vous pour accéder à vos excavations
          </motion.p>

          <form onSubmit={handleLogin} className="space-y-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <label
                className="block mb-2 text-xs"
                style={{
                  fontFamily: 'Bebas Neue, cursive',
                  letterSpacing: '2px',
                  color: '#C9A84C',
                }}
              >
                Adresse Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#7A7060' }} />
                <motion.input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 transition-all"
                  style={{
                    backgroundColor: '#141C2A',
                    border: '1px solid rgba(201, 168, 76, 0.3)',
                    fontFamily: 'JetBrains Mono, monospace',
                    color: '#EDE8DC',
                  }}
                  whileFocus={{
                    borderColor: '#C9A84C',
                    boxShadow: '0 0 20px rgba(201, 168, 76, 0.2)',
                  }}
                  required
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <label
                className="block mb-2 text-xs"
                style={{
                  fontFamily: 'Bebas Neue, cursive',
                  letterSpacing: '2px',
                  color: '#C9A84C',
                }}
              >
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#7A7060' }} />
                <motion.input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 transition-all"
                  style={{
                    backgroundColor: '#141C2A',
                    border: '1px solid rgba(201, 168, 76, 0.3)',
                    fontFamily: 'JetBrains Mono, monospace',
                    color: '#EDE8DC',
                  }}
                  whileFocus={{
                    borderColor: '#C9A84C',
                    boxShadow: '0 0 20px rgba(201, 168, 76, 0.2)',
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: '#7A7060' }}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </motion.div>

            <motion.div
              className="flex items-center justify-between"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4" style={{ accentColor: '#C9A84C' }} />
                <span
                  className="text-xs"
                  style={{ fontFamily: 'IBM Plex Mono, monospace', color: '#7A7060' }}
                >
                  Se souvenir
                </span>
              </label>
              <Link
                to="/forgot-password"
                className="text-xs hover:brightness-125 transition-all"
                style={{ fontFamily: 'IBM Plex Mono, monospace', color: '#C9A84C' }}
              >
                Mot de passe oublié?
              </Link>
            </motion.div>

            <motion.button
              type="submit"
              className="w-full py-4 relative overflow-hidden"
              style={{
                backgroundColor: '#C9A84C',
                color: '#080A0F',
                fontFamily: 'Bebas Neue, cursive',
                letterSpacing: '4px',
                fontSize: '18px',
              }}
              whileHover={{ 
                scale: 1.02,
                boxShadow: '0 0 30px rgba(201, 168, 76, 0.5)',
              }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              disabled={isLoading}
            >
              {isLoading && (
                <motion.div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                  }}
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
              {isLoading ? 'EXCAVATION EN COURS...' : 'ACCÉDER AUX ARCHIVES'}
            </motion.button>
          </form>

          <motion.div
            className="mt-8 text-center relative z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <div
              className="mb-4"
              style={{
                height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(201, 168, 76, 0.3), transparent)',
              }}
            />
            <p
              className="text-sm"
              style={{ fontFamily: 'IBM Plex Mono, monospace', color: '#7A7060' }}
            >
              Nouveau fouilleur?{' '}
              <Link
                to="/signup"
                className="hover:brightness-125 transition-all"
                style={{ color: '#C9A84C' }}
              >
                Créer un compte
              </Link>
            </p>
          </motion.div>
        </StratumCard>

        {/* Social login options */}
        <motion.div
          className="mt-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
        >
          <p
            className="text-xs mb-4"
            style={{ fontFamily: 'IBM Plex Mono, monospace', color: '#7A7060' }}
          >
            ou continuer avec
          </p>
          <div className="flex gap-4 justify-center">
            {['Google', 'GitHub', 'Discord'].map((provider, index) => (
              <motion.button
                key={provider}
                className="px-6 py-3 transition-all"
                style={{
                  border: '1px dashed rgba(201, 168, 76, 0.4)',
                  color: '#EDE8DC',
                  fontFamily: 'Bebas Neue, cursive',
                  letterSpacing: '2px',
                  backgroundColor: 'transparent',
                }}
                whileHover={{
                  borderColor: '#C9A84C',
                  borderStyle: 'solid',
                  backgroundColor: 'rgba(201, 168, 76, 0.1)',
                }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + index * 0.1 }}
              >
                {provider}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
