import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Brush, Lock, Mail, User, Eye, EyeOff } from 'lucide-react';
import { StratumCard } from '../components/StratumCard';
import { FloatingParticles } from '../components/FloatingParticles';

export function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      navigate('/login');
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-12" style={{ backgroundColor: '#080A0F' }}>
      <FloatingParticles />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md px-6"
      >
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <Link to="/">
            <motion.div
              className="inline-flex items-center justify-center mb-6"
              whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
              transition={{ duration: 0.5 }}
            >
              <Brush className="w-16 h-16" style={{ color: '#C9A84C' }} />
            </motion.div>
          </Link>
          <h1
            className="text-4xl mb-3"
            style={{ fontFamily: 'Cinzel, serif', color: '#EDE8DC' }}
          >
            Rejoindre MetaCraft
          </h1>
          <p
            className="text-sm"
            style={{
              fontFamily: 'IBM Plex Mono, monospace',
              color: '#7A7060',
            }}
          >
            Commencez votre voyage d'excavation numérique
          </p>
        </motion.div>

        <StratumCard className="p-8 relative overflow-hidden">
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

          <form onSubmit={handleSignup} className="space-y-5 relative z-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label
                className="block mb-2 text-xs"
                style={{
                  fontFamily: 'Bebas Neue, cursive',
                  letterSpacing: '2px',
                  color: '#C9A84C',
                }}
              >
                Nom complet
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#7A7060' }} />
                <motion.input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
              transition={{ delay: 0.5 }}
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
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#7A7060' }} />
                <motion.input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
                Confirmer mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#7A7060' }} />
                <motion.input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
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

            <motion.button
              type="submit"
              className="w-full py-4 relative overflow-hidden mt-6"
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
              transition={{ delay: 0.8 }}
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
              {isLoading ? 'CRÉATION EN COURS...' : 'CRÉER MON COMPTE'}
            </motion.button>
          </form>

          <motion.div
            className="mt-6 text-center relative z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
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
              Déjà membre?{' '}
              <Link
                to="/login"
                className="hover:brightness-125 transition-all"
                style={{ color: '#C9A84C' }}
              >
                Se connecter
              </Link>
            </p>
          </motion.div>
        </StratumCard>
      </motion.div>
    </div>
  );
}
